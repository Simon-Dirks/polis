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

const ViewStateSelect = ({ viewState, viewCategory, updateViewState }) => {
    return (
        <select
            name="viewstate-select"
            id="viewstate-select"
            value={viewState}
            onChange={(e) => {
                console.log('Updating view state', e.target.value)
                updateViewState(e.target.value)
            }}
        >
            {ViewStatesForCategory[viewCategory].map((viewState) => {
                return (
                    <option key={viewState} value={viewState}>
                        {viewState}
                    </option>
                )
            })}
        </select>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
})(ViewStateSelect)
