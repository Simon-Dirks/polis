// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import net from '../../util/net'
import * as globals from '../globals'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'
import { ViewCategory, ViewState } from '../../models/viewState'
import CommentList from './commentList'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from '../controls/arrowButton'
import Tag from '../tag'
import DataUtils from '../../util/dataUtils'

class allCommentsForParticipant extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            participantGroupId: -1,
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

        const participantClusterIdx = this.props.math['base-clusters'].members.findIndex(
            (clusterMembers) => {
                return clusterMembers.includes(pid)
            }
        )

        const participantGroupIdx = this.props.math['group-clusters'].findIndex((cluster) => {
            return cluster.members.includes(participantClusterIdx)
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

    isFirstParticipant() {
        const participantIds = DataUtils.getParticipantIds(this.props.math)
        if (!participantIds) {
            return false
        }
        return participantIds[0] === this.props.selectedParticipantId
    }

    getNumberOfGroups() {
        return Object.keys(this.props.math['group-votes']).length
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'h-full flex mt-6'}>
                <div className="flex-1 flex items-center justify-center">
                    {this.isFirstParticipant() ? (
                        <ArrowButton
                            overrideDisabled={false}
                            overrideClick={() => {
                                this.props.updateSelectedParticipantId(-1)
                                this.props.updateSelectedGroupId(this.getNumberOfGroups() - 1)
                                this.props.updateViewCategory(ViewCategory.AllStatements)
                                this.props.updateViewState(ViewState.AllStatementVotesSelectedGroup)
                            }}
                            direction={ArrowButtonDirection.Previous}
                            target={ArrowButtonTarget.Group}
                        ></ArrowButton>
                    ) : (
                        <ArrowButton
                            direction={ArrowButtonDirection.Previous}
                            target={ArrowButtonTarget.Participant}
                            math={this.props.math}
                        ></ArrowButton>
                    )}
                </div>

                <div className={'w-3/4 mx-auto overflow-y-auto'}>
                    {this.state.participantGroupId >= 0 && (
                        <p className={'text-xl text-kennislink-dark-gray'}>
                            Onderdeel van{' '}
                            <button
                                className={'underline'}
                                onClick={() => {
                                    this.props.updateSelectedGroupId(this.state.participantGroupId)
                                    this.props.updateViewCategory(ViewCategory.Groups)
                                    this.props.updateViewState(
                                        ViewState.GroupRepresentativeComments
                                    )
                                }}
                            >
                                Groep {globals.groupLabels[this.state.participantGroupId]}
                            </button>
                        </p>
                    )}

                    <h1 className={'font-semibold'}>
                        Stemgedrag Deelnemer {this.props.selectedParticipantId} op alle stellingen
                    </h1>

                    {this.getParticipantCommentVotes() && (
                        <div className="mb-6">
                            <Tag>Aantal stellingen: {this.getParticipantCommentVotes().length}</Tag>
                        </div>
                    )}

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

                <div className="flex-1 flex items-center justify-center">
                    <ArrowButton
                        direction={ArrowButtonDirection.Next}
                        target={ArrowButtonTarget.Participant}
                        math={this.props.math}
                    ></ArrowButton>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, {
    updateSelectedParticipantId,
    updateSelectedGroupId,
    updateViewState,
    updateViewCategory,
})(allCommentsForParticipant)
