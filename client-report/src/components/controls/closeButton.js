import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'

const CloseButton = ({ viewState, updateViewState }) => {
    const onClick = () => {
        if (
            viewState === ViewState.Statement ||
            viewState === ViewState.AllStatements ||
            viewState === ViewState.StatementSpecificGroup
        ) {
            updateViewState(ViewState.StatementsGraph)
        } else {
            updateViewState(ViewState.ParticipantsGraph)
        }
    }

    return (
        <button onClick={onClick} className={'text-3xl'}>
            X
        </button>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
})(CloseButton)
