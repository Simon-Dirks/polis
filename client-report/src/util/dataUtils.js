// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import _ from 'lodash'

function getVoteTotals(math_main) {
    var x = {}
    var gv = math_main['group-votes']
    _.each(gv, function (data /*, gid*/) {
        _.each(data.votes, function (counts, tid) {
            var z = (x[tid] = x[tid] || { agreed: 0, disagreed: 0, saw: 0 })
            z.agreed += counts.A
            z.disagreed += counts.D
            z.saw += counts.S
        })
    })
    _.each(x, function (z) {
        z.pctAgreed = z.agreed / z.saw
        z.pctDisagreed = z.disagreed / z.saw
        z.pctVoted = (z.saw - z.disagreed - z.agreed) / z.saw
    })
    return x
}

function getGroupIdsForComment(commentId, math) {
    const groupIds = []
    for (const [gid, comments] of Object.entries(math['repness'])) {
        const commentRepresentsGroup = comments.some((c) => c.tid === commentId)
        if (commentRepresentsGroup) {
            groupIds.push(gid)
        }
    }

    return groupIds
}

function getParticipantIds(math) {
    if (!math || !('in-conv' in math)) {
        return []
    }
    return Object.values(math['in-conv']).sort((a, b) => a - b)
}

function getGroupVotesForComments(gid, math, comments) {
    const commentsWithGroupVotes = []
    const groupVotes = math['group-votes'][gid]['votes']
    for (const [tid, commentVotes] of Object.entries(groupVotes)) {
        const comment = comments.find((c) => c.tid === parseInt(tid))
        if (!comment) {
            // Some comments might have been voted on by participant, but are not part of the conversation (yet)
            continue
        }

        const groupVotesForComment = {
            txt: comment.txt,
            tid: comment.tid,
            pid: comment.pid,
            agreed: commentVotes.A,
            disagreed: commentVotes.D,
            saw: commentVotes.S,
        }

        commentsWithGroupVotes.push(groupVotesForComment)
    }

    return commentsWithGroupVotes
}

function calculateVariance(votes) {
    if (votes.length === 0) {
        return 0
    }

    const mean = votes.reduce((sum, vote) => sum + vote, 0) / votes.length
    const squaredDifferences = votes.map((vote) => Math.pow(vote - mean, 2))
    const variance =
        squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / votes.length

    return variance
}

const dataUtils = {
    getVoteTotals: getVoteTotals,
    getGroupIdsForComment: getGroupIdsForComment,
    getParticipantIds: getParticipantIds,
    getGroupVotesForComments: getGroupVotesForComments,
    calculateVariance: calculateVariance,
}
export default dataUtils
