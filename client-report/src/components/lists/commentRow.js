import _ from 'lodash'
import VotePieChart from '../votePieChart'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedStatementId, updateViewState } from '../../store/actions'
import { ViewState } from '../../models/viewState'

const CommentRow = ({
    comment,
    groups,
    voteColors,
    updateSelectedStatementId,
    updateViewState,
}) => {
    if (!comment) {
        console.error('No comment passed')
        return null
    }

    let totalMembers = 0
    _.forEach(groups, (g) => {
        let nMembers = g['n-members']
        totalMembers += nMembers
    })

    return (
        <>
            <div className={'flex flex-row py-4'}>
                <div className={'flex items-center pr-4'}>
                    <VotePieChart
                        comment={comment}
                        voteCounts={{
                            A: comment.agreed,
                            D: comment.disagreed,
                            S: comment.saw,
                        }}
                        nMembers={totalMembers}
                        voteColors={voteColors}
                        sizePx={50}
                    />
                </div>
                <div>
                    <button
                        className={'text-sm underline'}
                        onClick={() => {
                            updateSelectedStatementId(comment.tid)
                            updateViewState(ViewState.Statement)
                        }}
                    >
                        Stelling {comment.tid}
                    </button>
                    <p className={'text-lg'}>{comment.txt}</p>
                </div>
            </div>
            <div className={'h-1 border-b-2'}></div>
        </>
    )
}

export default connect(mapStateToProps, { updateViewState, updateSelectedStatementId })(CommentRow)
