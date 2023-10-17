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
            groupVotesForAllComments: null,
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
        this.updateGroupVotesForAllComments()
    }

    updateNumParticipantsOfGroup() {
        if (!this.props.math || this.props.gid === undefined) {
            return null
        }

        return this.props.math['group-clusters'][this.props.gid]?.members?.length
    }

    updateGroupVoteColors() {
        if (this.props.gid === undefined || this.props.gid >= globals.brandColors.groups.length) {
            return
        }

        this.setState({ groupVoteColors: globals.brandColors.groups[this.props.gid] })
    }

    updateGroupVotesForAllComments() {
        if (!this.props.math || this.props.gid === undefined || !this.props.comments) {
            return
        }
        const groupVotesForAllComments = []
        const groupVotes = this.props.math['group-votes'][this.props.gid]['votes']
        for (const [tid, votes] of Object.entries(groupVotes)) {
            const comment = this.props.comments.find((c) => c.tid === parseInt(tid))
            if (!comment) {
                // Some comments might have been voted on by participant, but are not part of the conversation (yet)
                continue
            }

            groupVotesForAllComments.push({
                tid: tid,
                txt: comment?.txt,
                votes: votes,
            })
        }

        this.setState({ groupVotesForAllComments: groupVotesForAllComments })
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'mt-8'}>
                <h1>
                    Stemgedrag groep {globals.groupLabels[this.props.gid]} (
                    {this.updateNumParticipantsOfGroup()}) op alle stellingen
                    {this.state.groupVotesForAllComments && (
                        <span> ({this.state.groupVotesForAllComments.length})</span>
                    )}
                </h1>

                {this.state.groupVotesForAllComments && (
                    <div>
                        {this.state.groupVotesForAllComments.map((votesForComment) => {
                            return (
                                <div key={votesForComment.tid}>
                                    <p>
                                        {`${votesForComment.tid}.
                                        ${votesForComment.txt}, votes:
                                        ${JSON.stringify(votesForComment.votes)}`}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}

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
        )
    }
}

export default allCommentsForGroup
