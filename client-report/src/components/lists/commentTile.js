import _ from 'lodash'
import VotePieChart from '../votePieChart'
import React from 'react'

const CommentTile = ({ comment, groups, voteColors }) => {
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
                <p className={'text-sm mt-2'}>Stelling {comment.tid}</p>
                <p className={'text-lg'}>{comment.txt}</p>
            </div>
        </div>
    )
}
export default CommentTile
