import _ from 'lodash'
import VotePieChart from '../votePieChart'
import React from 'react'
import { connect } from 'react-redux'
import { updateSelectedStatementId, updateViewCategory, updateViewState } from '../../store/actions'
import { mapStateToProps } from '../../store/mapStateToProps'

const CommentTile = ({
    comment,
    groups,
    voteColors,
    updateSelectedStatementId,
    updateViewState,
    updateViewCategory,
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
        <div>
            <VotePieChart
                comment={comment}
                voteCounts={{
                    A: comment.agreed,
                    D: comment.disagreed,
                    S: comment.saw,
                }}
                nMembers={totalMembers}
                voteColors={voteColors}
                sizePx={150}
            />
            <div>
                <p className={'text-sm mt-2 leading-5 mb-1 text-kennislink-dark-gray'}>
                    Stelling {comment.tid}
                    {/*<button*/}
                    {/*  onClick={() => {*/}
                    {/*    updateSelectedStatementId(comment.tid)*/}
                    {/*    updateViewCategory(ViewCategory.IndivididualStatements)*/}
                    {/*    updateViewState(ViewState.Statement)*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*</button>*/}
                </p>
                <p className={'text-lg font-medium leading-6'}>{comment.txt}</p>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedStatementId,
    updateViewCategory,
})(CommentTile)
