import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'

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
    disabled,
    target,
    direction,
}) => {
    const onClick = () => {
        const addToId = direction === ArrowButtonDirection.Next ? 1 : -1

        switch (target) {
            case ArrowButtonTarget.Participant:
                updateSelectedParticipantId(selectedParticipantId + addToId)
                break
            case ArrowButtonTarget.Group:
                updateSelectedGroupId(selectedGroupId + addToId)
                break
            case ArrowButtonTarget.Statement:
                updateSelectedStatementId(selectedStatementId + addToId)
                break
        }
    }

    return (
        <button
            onClick={onClick}
            className={'text-right text-3xl'}
            disabled={disabled}
            style={{ opacity: disabled ? '40%' : 'initial' }}
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
