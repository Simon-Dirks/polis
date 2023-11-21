import React, { useEffect, useState } from 'react'
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

const StatementSelect = ({ selectedStatementId, updateSelectedStatementId, math, comments }) => {
    const [sortedComments, setSortedComments] = useState([])
    useEffect(() => {
        setSortedComments(_.sortBy(comments, 'tid'))
    }, [comments])
    return (
        <select
            name="statement-select"
            id="statement-select"
            value={selectedStatementId}
            onChange={(e) => {
                const tid = Number(e.target.value)
                console.log('Updating selected statement id', tid)
                updateSelectedStatementId(tid)
            }}
        >
            {sortedComments.map((comment) => {
                return (
                    <option key={comment.tid} value={comment.tid}>
                        {comment.tid} {comment.txt}
                    </option>
                )
            })}
        </select>
    )
}
export default connect(mapStateToProps, {
    updateSelectedStatementId,
})(StatementSelect)
