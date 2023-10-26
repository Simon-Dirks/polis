// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import net from '../../util/net'
import * as globals from '../globals'

class allCommentsForParticipant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            participantId: 0,
            participantGroupId: 0,
            participantVotes: null,
        }
    }

    componentDidMount() {
        this.onParticipantIdChanged({ target: { value: 0 } })
    }

    onParticipantIdChanged(event) {
        const pid = parseInt(event.target.value)
        this.setState({
            participantId: pid,
        })

        void this.updateParticipantVotes(pid)
        void this.updateParticipantGroup(pid)
    }

    updateParticipantGroup(pid) {
        if (pid === undefined || !this.props.math) {
            this.setState({ participantGroupId: -1 })
            return null
        }

        // TODO: Make sure members in group-clusters are zero-indexed (it seems that participant 0 does not belong to a group now, is that correct? The other participant groups seem to match the visualization)
        const participantGroupIdx = this.props.math['group-clusters'].findIndex((cluster) => {
            return cluster.members.includes(pid)
        })
        this.setState({ participantGroupId: participantGroupIdx })
    }

    getVotes(conversation_id, pid) {
        return net.polisGet('/api/v3/votes', {
            conversation_id: conversation_id,
            pid: pid,
        })
    }

    async updateParticipantVotes(pid) {
        if (!this.props.conversation) {
            return
        }
        this.setState({ participantVotes: null })
        // TODO: Set / show loading state
        const conversationId = this.props.conversation?.conversation_id
        const participantVotes = await this.getVotes(conversationId, pid)
        this.setState({ participantVotes: participantVotes })
    }

    getParticipantComments() {
        if (!this.props.comments || !this.state.participantVotes) {
            return null
        }
        return this.state.participantVotes
            .map((vote) => {
                const comment = this.props.comments.find((comment) => comment.tid === vote.tid)
                return comment ? { txt: comment.txt, tid: vote.tid, vote: vote.vote } : null
            })
            .filter((item) => item !== null)
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'mt-8'}>
                {this.state.participantGroupId > 0 && (
                    <h2>
                        Deelnemer {this.state.participantId} is onderdeel van groep{' '}
                        {globals.groupLabels[this.state.participantGroupId]}
                    </h2>
                )}

                <h1>
                    Alle stellingen{' '}
                    {this.getParticipantComments() && `(${this.getParticipantComments().length})`}{' '}
                    waarop deelnemer {this.state.participantId} gestemd heeft
                </h1>
                <input
                    type="number"
                    value={this.state.participantId}
                    onChange={this.onParticipantIdChanged.bind(this)}
                    className={'mb-4'}
                />
                {this.getParticipantComments() &&
                    this.getParticipantComments().map((comment) => {
                        return (
                            <div key={comment.tid}>
                                <p>
                                    {comment.txt} (tid: {comment.tid}, gestemd: {comment.vote})
                                </p>
                                <hr />
                            </div>
                        )
                    })}
            </div>
        )
    }
}

export default allCommentsForParticipant
