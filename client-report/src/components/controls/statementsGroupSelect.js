import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewState } from '../../store/actions'
import { ViewState } from '../../models/viewState'
import { groupLabels } from '../globals'
import DropDown from './dropDown'

const StatementsGroupSelect = ({
    selectedGroupId,
    selectedParticipantId,
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

    return (
        <DropDown buttonLabel={buttonLabel}>
            <li className={selectedGroupId === -1 ? 'font-semibold' : ''}>
                <a
                    onClick={() => {
                        updateViewState(ViewState.AllStatementVotes)
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
                                updateSelectedGroupId(gid)
                                updateViewState(ViewState.AllStatementVotesSelectedGroup)
                            }}
                        >
                            Groep {groupLabels[gid]}
                        </a>
                    </li>
                )
            })}
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateSelectedGroupId,
    updateViewState,
})(StatementsGroupSelect)
