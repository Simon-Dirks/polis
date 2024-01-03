import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedStatementId } from '../../store/actions'
import _ from 'lodash'
import DropDown from './dropDown'

const StatementSelect = ({ selectedStatementId, updateSelectedStatementId, math, comments }) => {
    const [sortedComments, setSortedComments] = useState([])
    useEffect(() => {
        setSortedComments(_.sortBy(comments, 'tid'))
    }, [comments])
    const selectedStatement = comments.find((comment) => comment.tid === selectedStatementId)

    return (
        <DropDown buttonLabel={`Stelling ${selectedStatement.tid}`}>
            {sortedComments.map((comment) => {
                return (
                    <li
                        key={comment.tid}
                        className={selectedStatementId === comment.tid ? 'font-semibold' : ''}
                    >
                        <a
                            onClick={() => {
                                console.log('Updating selected statement id', comment.tid)
                                updateSelectedStatementId(comment.tid)
                            }}
                        >
                            Stelling {comment.tid} - {comment.txt}
                        </a>
                    </li>
                )
            })}
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateSelectedStatementId,
})(StatementSelect)
