// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import net from '../../util/net'
import * as globals from '../globals'
import CommentList from './commentList'

class allCommentsForGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numParticipantsGroup: null,
            groupVoteColors: this.props.voteColors,
            commentsWithVotesOfGroup: null,
        }
    }

    componentDidMount() {
        this.onGroupIdUpdate()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gid !== this.props.gid) {
            this.onGroupIdUpdate()
        }
    }

    onGroupIdUpdate() {
        this.updateNumParticipantsOfGroup()
        this.updateGroupVoteColors()
        this.updateCommentsWithVotesOfGroup()
    }

    updateNumParticipantsOfGroup() {
        if (!this.props.math || this.props.gid === undefined) {
            return null
        }

        return this.props.math['group-clusters'][this.props.gid]?.members?.length
    }

    updateGroupVoteColors() {
        if (this.props.gid === undefined) {
            return
        }

        if (this.props.gid < globals.brandColors.groups.length) {
            this.setState({ groupVoteColors: globals.brandColors.groups[this.props.gid] })
        }
    }

    updateCommentsWithVotesOfGroup() {
        // TODO
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'mt-8'}>
                <h1>
                    Stemgedrag groep {globals.groupLabels[this.props.gid]} (
                    {this.updateNumParticipantsOfGroup()}) op alle stellingen (...)
                </h1>

                <div>
                    {/*<CommentList*/}
                    {/*    conversation={this.props.conversation}*/}
                    {/*    ptptCount={this.props.ptptCount}*/}
                    {/*    math={this.props.math}*/}
                    {/*    formatTid={this.props.formatTid}*/}
                    {/*    tidsToRender={this.props.comments.map((c) => c.tid)}*/}
                    {/*    comments={this.props.comments}*/}
                    {/*    voteColors={this.state.groupVoteColors}*/}
                    {/*/>*/}
                </div>
            </div>
        )
    }
}

export default allCommentsForGroup
