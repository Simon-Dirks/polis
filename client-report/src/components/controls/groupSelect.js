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

const GroupSelect = ({ selectedGroupId, updateSelectedGroupId, math }) => {
    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    const getGroupIds = () => {
        return [...Array(getNumberOfGroups()).keys()]
    }

    return (
        <select
            name="group-select"
            id="group-select"
            value={selectedGroupId}
            onChange={(e) => {
                const gid = Number(e.target.value)
                console.log('Updating selected group id', gid)
                updateSelectedGroupId(gid)
            }}
        >
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
})(GroupSelect)
