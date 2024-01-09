// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
// import * as globals from '../globals'
import CommentRow from './commentRow'

class CommentList extends React.Component {
    render() {
        const comments = _.keyBy(this.props.comments, 'tid')

        return (
            <div className={'pb-6'}>
                {this.props.tidsToRender.map((tid, i) => {
                    return (
                        <CommentRow
                            key={i}
                            index={i}
                            groups={this.props.math['group-votes']}
                            comment={comments[tid]}
                            voteColors={this.props.voteColors}
                            isRounded={this.props.isRounded}
                        />
                    )
                })}
            </div>
        )
    }
}

export default CommentList
