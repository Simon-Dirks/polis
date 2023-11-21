// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import net from '../../util/net'
import * as globals from '../globals'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'
import CommentList from './commentList'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from '../controls/arrowButton'

class allCommentsForParticipant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            participantGroupId: 0,
            participantVotes: null,
        }
    }

    componentDidMount() {
        const selectedParticipantId = this.props.selectedParticipantId
        void this.updateParticipantVotes(selectedParticipantId)
        void this.updateParticipantGroup(selectedParticipantId)
    }

    componentDidUpdate(prevProps) {
        const selectedParticipantId = this.props.selectedParticipantId
        if (selectedParticipantId !== prevProps.selectedParticipantId) {
            void this.updateParticipantVotes(selectedParticipantId)
            void this.updateParticipantGroup(selectedParticipantId)
        }
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

        const sortingOrder = [-1, 1, 0]
        const sortedParticipantsVotes = participantVotes.sort(
            (a, b) => sortingOrder.indexOf(a.vote) - sortingOrder.indexOf(b.vote)
        )

        this.setState({ participantVotes: sortedParticipantsVotes })
    }

    getParticipantCommentVotes() {
        if (!this.props.comments || !this.state.participantVotes) {
            return null
        }

        const participantCommentVotes = this.state.participantVotes
            .map((vote) => {
                let agreed = 0
                let disagreed = 0
                const saw = 1

                if (vote.vote === -1) {
                    agreed = 1
                } else if (vote.vote === 1) {
                    disagreed = 1
                }

                const comment = this.props.comments.find((comment) => comment.tid === vote.tid)
                return comment
                    ? {
                          txt: comment.txt,
                          tid: vote.tid,
                          agreed: agreed,
                          disagreed: disagreed,
                          saw: saw,
                      }
                    : null
            })
            .filter((item) => item !== null)
        return participantCommentVotes
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'mt-8'}>
                {this.state.participantGroupId > 0 && (
                    <h2>
                        Deelnemer {this.props.selectedParticipantId} is onderdeel van{' '}
                        <button
                            className={'underline'}
                            onClick={() => {
                                this.props.updateSelectedGroupId(this.state.participantGroupId)
                                this.props.updateViewState(ViewState.GroupRepresentativeComments)
                            }}
                        >
                            Groep {globals.groupLabels[this.state.participantGroupId]}
                        </button>
                    </h2>
                )}

                <h1>
                    Alle stellingen{' '}
                    {this.getParticipantCommentVotes() &&
                        `(${this.getParticipantCommentVotes().length})`}{' '}
                    waarop deelnemer {this.props.selectedParticipantId} gestemd heeft
                </h1>

                <div className={'grid grid-cols-12'}>
                    <div className={'col-span-1'}>
                        {/*TODO: Add disabled state*/}
                        <ArrowButton
                            direction={ArrowButtonDirection.Previous}
                            target={ArrowButtonTarget.Participant}
                            // disabled={false}
                        ></ArrowButton>
                    </div>
                    <div className={'col-span-10'}>
                        {this.getParticipantCommentVotes() && (
                            <CommentList
                                conversation={this.props.conversation}
                                math={this.props.math}
                                tidsToRender={this.getParticipantCommentVotes().map((c) => c.tid)}
                                comments={this.getParticipantCommentVotes()}
                                voteColors={this.props.voteColors}
                                isRounded={true}
                            />
                        )}
                    </div>
                    <div className={'col-span-1'}>
                        {/*TODO: Add disabled state*/}
                        <ArrowButton
                            direction={ArrowButtonDirection.Next}
                            target={ArrowButtonTarget.Participant}
                            // disabled={false}
                        ></ArrowButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, {
    updateSelectedParticipantId,
    updateSelectedGroupId,
    updateViewState,
})(allCommentsForParticipant)
