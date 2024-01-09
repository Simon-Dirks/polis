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
    if ('group-clusters' in math) {
        const allGroupMembersFlattened = math['group-clusters'].reduce((acc, group) => {
            return acc.concat(group.members)
        }, [])
        allGroupMembersFlattened.sort((a, b) => a - b)
        return allGroupMembersFlattened
    }
    return []
}

const dataUtils = {
    getVoteTotals: getVoteTotals,
    getGroupIdsForComment: getGroupIdsForComment,
    getParticipantIds: getParticipantIds,
}
export default dataUtils
