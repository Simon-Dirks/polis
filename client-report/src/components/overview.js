// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'

const computeVoteTotal = (users) => {
    let voteTotal = 0

    _.each(users, (count) => {
        voteTotal += count
    })

    return voteTotal
}

// const computeUniqueCommenters = (comments) => {

// }

const Overview = ({
    // conversation,
    // demographics,
    ptptCount,
    ptptCountTotal,
    math,
    // comments,
    //stats,
    // computedStats,
}) => {
    return (
        <div>
            <div>
                <p className={'font-bold'}>{ptptCount}</p> <p>gestemd</p>
            </div>
            <div>
                <p className={'font-bold'}>{ptptCountTotal}</p> <p>gegroepeerd</p>
            </div>
            <div className={'mt-2'}>
                <p className={'font-bold'}>{computeVoteTotal(math['user-vote-counts'])}</p>
                <p>Stemmen</p>
            </div>
            <div className={'mt-2'}>
                <p className={'font-bold'}>{math['n-cmts']}</p>
                <p>Stellingen</p>
            </div>
        </div>
    )
}

export default Overview
