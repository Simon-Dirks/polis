// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
import * as globals from './globals'

const computeVoteTotal = (users) => {
    let voteTotal = 0

    _.each(users, (count) => {
        voteTotal += count
    })

    return voteTotal
}

// const computeUniqueCommenters = (comments) => {

// }

const Number = ({ number, label }) => (
    <div style={{ marginLeft: '10px', marginRight: '10px' }}>
        <p style={globals.overviewNumber}>{number.toLocaleString()}</p>
        <p style={globals.overviewLabel}>{label}</p>
    </div>
)

const Overview = ({
    // conversation,
    // demographics,
    // ptptCount,
    ptptCountTotal,
    math,
    // comments,
    //stats,
    // computedStats,
}) => {
    return (
        <div>
            <p>{ptptCountTotal} Deelnemers</p>
            <p>{computeVoteTotal(math['user-vote-counts'])} stemmen</p>
            <p>{math['n-cmts']} stellingen</p>
        </div>
    )
}

export default Overview
