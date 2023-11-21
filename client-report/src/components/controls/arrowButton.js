import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'
import _ from 'lodash'

export const ArrowButtonTarget = {
    Participant: 'participant',
    Group: 'group',
    Statement: 'statement',
}

export const ArrowButtonDirection = {
    Next: 'next',
    Previous: 'previous',
}

const ArrowButton = ({
    updateViewState,
    selectedParticipantId,
    selectedGroupId,
    selectedStatementId,
    updateSelectedGroupId,
    updateSelectedStatementId,
    updateSelectedParticipantId,
    target,
    direction,
    comments,
    overrideDisabled,
}) => {
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if (ArrowButtonTarget.Statement) {
            const nextTid = getNextCommentTid()
            setDisabled(!nextTid)
        }
    }, [selectedStatementId])

    const getNextCommentTid = () => {
        const addToId = direction === ArrowButtonDirection.Next ? 1 : -1
        const sortedComments = _.sortBy(comments, 'tid')
        const currentIdx = sortedComments.findIndex((c) => c.tid === selectedStatementId)
        if (currentIdx + addToId in sortedComments) {
            const nextTid = sortedComments[currentIdx + addToId].tid
            return nextTid
        }
        return undefined
    }

    const onClick = () => {
        const addToId = direction === ArrowButtonDirection.Next ? 1 : -1

        switch (target) {
            case ArrowButtonTarget.Participant:
                updateSelectedParticipantId(selectedParticipantId + addToId)
                break
            case ArrowButtonTarget.Group:
                updateSelectedGroupId(selectedGroupId + addToId)
                break
            case ArrowButtonTarget.Statement: {
                const nextTid = getNextCommentTid()
                if (nextTid) {
                    updateSelectedStatementId(nextTid)
                }
                break
            }
        }
    }

    const isDisabled = overrideDisabled ?? disabled
    return (
        <button
            onClick={onClick}
            className={'text-right text-3xl'}
            disabled={isDisabled}
            style={{ opacity: isDisabled ? '40%' : 'initial' }}
        >
            {direction === ArrowButtonDirection.Next ? '→' : '←'}
        </button>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
})(ArrowButton)
