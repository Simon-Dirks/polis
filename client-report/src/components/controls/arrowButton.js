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
import arrowRight from '../../assets/arrow-right.svg'
import arrowLeft from '../../assets/arrow-left.svg'
import DataUtils from '../../util/dataUtils'

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
    math,
    overrideDisabled,
    overrideClick,
}) => {
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        let shouldBeDisabled = false

        if (target === ArrowButtonTarget.Statement) {
            const nextTid = getNextCommentTid()
            if (nextTid === undefined) {
                shouldBeDisabled = true
            }
        }
        if (target === ArrowButtonTarget.Participant) {
            const nextPid = getNextParticipantPid()
            if (nextPid === undefined) {
                shouldBeDisabled = true
            }
        }
        setDisabled(shouldBeDisabled)
    }, [target, selectedStatementId, selectedParticipantId])

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

    const getNextParticipantPid = () => {
        const participantIds = DataUtils.getParticipantIds(math)
        if (!participantIds) {
            return undefined
        }

        const currentParticipantIdx = participantIds.findIndex((id) => id === selectedParticipantId)
        const addToIdx = direction === ArrowButtonDirection.Next ? 1 : -1
        const nextParticipantIdx = currentParticipantIdx + addToIdx
        if (nextParticipantIdx in participantIds) {
            const nextParticipantId = participantIds[nextParticipantIdx]
            return nextParticipantId
        }
        return undefined
    }

    const onClick = () => {
        if (overrideClick) {
            overrideClick()
            return
        }

        const addToId = direction === ArrowButtonDirection.Next ? 1 : -1

        switch (target) {
            case ArrowButtonTarget.Participant: {
                const nextPid = getNextParticipantPid()
                if (nextPid !== undefined) {
                    updateSelectedParticipantId(nextPid)
                }
                break
            }
            case ArrowButtonTarget.Group:
                updateSelectedGroupId(selectedGroupId + addToId)
                break
            case ArrowButtonTarget.Statement: {
                const nextTid = getNextCommentTid()
                if (nextTid !== undefined) {
                    updateSelectedStatementId(nextTid)
                }
                break
            }
        }
    }

    const isDisabled = overrideDisabled ?? disabled
    let label = 'groep'
    if (target === ArrowButtonTarget.Statement) {
        label = 'stelling'
    } else if (target === ArrowButtonTarget.Participant) {
        label = 'deelnemer'
    }
    return (
        <div className={'text-center'}>
            <button
                onClick={onClick}
                className={'text-3xl text-center m-4'}
                disabled={isDisabled}
                style={{ opacity: isDisabled ? '40%' : 'initial' }}
            >
                <img
                    src={direction === ArrowButtonDirection.Next ? arrowRight : arrowLeft}
                    alt={'Arrow icon'}
                    className={'h-12 mx-auto'}
                />

                <p className={'text-xl'}>
                    {direction === ArrowButtonDirection.Next ? 'Volgende ' : 'Vorige '} {label}
                </p>
            </button>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
})(ArrowButton)
