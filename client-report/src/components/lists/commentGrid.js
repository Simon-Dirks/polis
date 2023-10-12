// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
// import * as globals from '../globals'
import CommentTile from './commentTile'
import * as globals from '../globals'

class CommentGrid extends React.Component {
    render() {
        const comments = _.keyBy(this.props.comments, 'tid')

        return (
            <div className={'grid grid-cols-2 lg:grid-cols-4'}>
                {this.props.tidsToRender.map((tid, i) => {
                    if (!comments[tid]) {
                        return null
                    }

                    return (
                        <div className={'pb-4'} key={i}>
                            <CommentTile
                                index={i}
                                groups={this.props.math['group-votes']}
                                comment={comments[tid]}
                                voteColors={this.props.voteColors}
                                sizePx={150}
                            />
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default CommentGrid
