import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'
import { ViewCategory, ViewState, ViewStatesForCategory } from '../../models/viewState'
import _ from 'lodash'
import { groupLabels } from '../globals'
import ViewStateSelect from './viewStateSelect'

const StatementsGroupSelect = ({
    selectedGroupId,
    updateSelectedGroupId,
    math,
    updateViewState,
}) => {
    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    const getGroupIds = () => {
        return [...Array(getNumberOfGroups()).keys()]
    }

    const selectedValue = selectedGroupId === -1 ? ViewState.AllStatementVotes : selectedGroupId

    return (
        <select
            name="statements-group-select"
            id="statements-group-select"
            value={selectedValue}
            onChange={(e) => {
                const selected = e.target.value
                if (selected === ViewState.AllStatementVotes) {
                    updateViewState(ViewState.AllStatementVotes)
                    updateSelectedGroupId(-1)
                    return
                }
                const gid = Number(selected)
                console.log('Updating selected group id', gid)
                updateSelectedGroupId(gid)
                updateViewState(ViewState.AllStatementVotesSelectedGroup)
            }}
        >
            <option value={ViewState.AllStatementVotes}>Alle deelnemers</option>

            {getGroupIds().map((gid) => {
                return (
                    <option key={gid} value={gid}>
                        Groep {groupLabels[gid]}
                    </option>
                )
            })}
        </select>
    )
}
export default connect(mapStateToProps, {
    updateSelectedGroupId,
    updateViewState,
})(StatementsGroupSelect)
