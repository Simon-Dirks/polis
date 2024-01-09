import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'
import { groupLabels } from '../globals'
import DropDown from './dropDown'
import DataUtils from '../../util/dataUtils'

const StatementsGroupSelect = ({
    selectedGroupId,
    selectedParticipantId,
    updateSelectedParticipantId,
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

    let buttonLabel = 'Alle deelnemers'
    if (selectedGroupId >= 0) {
        buttonLabel = `Groep ${groupLabels[selectedGroupId]}`
    }
    if (selectedParticipantId >= 0) {
        buttonLabel = `Deelnemer ${selectedParticipantId}`
    }

    // TODO: UseEffect to update when math changes?
    const participantIds = DataUtils.getParticipantIds(math)

    return (
        <DropDown buttonLabel={buttonLabel}>
            <li
                className={
                    selectedGroupId === -1 && selectedParticipantId === -1 ? 'font-semibold' : ''
                }
            >
                <a
                    onClick={() => {
                        updateViewState(ViewState.AllStatementVotes)
                        updateSelectedParticipantId(-1)
                        updateSelectedGroupId(-1)
                    }}
                >
                    Alle deelnemers
                </a>
            </li>

            {getGroupIds().map((gid) => {
                return (
                    <li key={gid} className={gid === selectedGroupId ? 'font-semibold' : ''}>
                        <a
                            onClick={() => {
                                console.log('Updating selected group id', gid)
                                updateSelectedParticipantId(-1)
                                updateSelectedGroupId(gid)
                                updateViewState(ViewState.AllStatementVotesSelectedGroup)
                            }}
                        >
                            Groep {groupLabels[gid]}
                        </a>
                    </li>
                )
            })}

            {participantIds.map((pid) => {
                return (
                    <li key={pid} className={pid === selectedParticipantId ? 'font-semibold' : ''}>
                        <a
                            onClick={() => {
                                console.log('Updating selected participant id', pid)
                                updateSelectedGroupId(-1)
                                updateSelectedParticipantId(pid)
                                updateViewState(ViewState.Participant)
                            }}
                        >
                            Deelnemer {pid}
                        </a>
                    </li>
                )
            })}
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateViewState,
})(StatementsGroupSelect)
