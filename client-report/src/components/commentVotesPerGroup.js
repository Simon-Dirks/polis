import _ from 'lodash'
import React from 'react'
import VotePieChart from './votePieChart'

const CommentVotesPerGroup = ({ comments, groupVotes, voteColors, commentTid }) => {
    if (!comments) {
        console.error('No comments passed')
        return null
    }

    let totalMembers = 0
    _.forEach(groupVotes, (g) => {
        let nMembers = g['n-members']
        totalMembers += nMembers
    })

    const commentsByTid = _.keyBy(comments, 'tid')
    const comment = commentsByTid[commentTid]

    console.log(groupVotes, comment)

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

            {/*TODO: Show votes for other groups here*/}
            <div>
                <p className={'text-sm mt-2'}>Stelling {comment.tid}</p>
                <p className={'text-lg'}>{comment.txt}</p>
            </div>
        </div>
    )
}
export default CommentVotesPerGroup
