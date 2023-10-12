// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
// import * as globals from '../globals'
import VotePieChart from '../votePieChart'

const CommentRow = ({ comment, groups, voteColors }) => {
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
                    />
                </div>
                <div>
                    <p>Stelling {comment.tid}</p>
                    <p className={'text-2xl font-bold'}>{comment.txt}</p>
                </div>
            </div>
            <div className={'h-1 border-b-2'}></div>
        </>
    )
}

class CommentList extends React.Component {
    render() {
        const comments = _.keyBy(this.props.comments, 'tid')

        return (
            <div>
                {this.props.tidsToRender.map((tid, i) => {
                    return (
                        <CommentRow
                            key={i}
                            index={i}
                            groups={this.props.math['group-votes']}
                            comment={comments[tid]}
                            voteColors={this.props.voteColors}
                        />
                    )
                })}
            </div>
        )
    }
}

export default CommentList
