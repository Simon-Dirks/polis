// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import * as globals from '../globals'
import CommentList from './commentList'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import Tag from '../tag'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from '../controls/arrowButton'
import { ViewCategory, ViewState } from '../../models/viewState'

class allCommentsForGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            numParticipantsGroup: null,
            groupVoteColors: this.props.voteColors,
            commentsWithGroupVotes: null,
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
        this.getNumParticipantsOfGroup()
        this.updateGroupVoteColors()
        this.updateGroupVotesForAllComments()
    }

    getNumParticipantsOfGroup() {
        if (!this.props.math || this.props.gid === undefined) {
            return null
        }

        // console.log(this.props.math)
        return this.props.math['group-votes'][this.props.gid]['n-members']
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
        const commentsWithGroupVotes = []
        const groupVotes = this.props.math['group-votes'][this.props.gid]['votes']
        for (const [tid, commentVotes] of Object.entries(groupVotes)) {
            const comment = this.props.comments.find((c) => c.tid === parseInt(tid))
            if (!comment) {
                // Some comments might have been voted on by participant, but are not part of the conversation (yet)
                continue
            }

            const groupVotesForComment = {
                txt: comment.txt,
                tid: comment.tid,
                pid: comment.pid,
                agreed: commentVotes.A,
                disagreed: commentVotes.D,
                saw: commentVotes.S,
            }

            commentsWithGroupVotes.push(groupVotesForComment)
        }

        this.setState({ commentsWithGroupVotes: commentsWithGroupVotes })
    }

    getNumberOfGroups() {
        return Object.keys(this.props.math['group-votes']).length
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading..</div>
        }

        return (
            <div className={'h-full flex'}>
                <div className="flex-1 flex justify-center items-center">
                    {this.props.gid === 0 && (
                        <ArrowButton
                            overrideDisabled={false}
                            overrideClick={() => {
                                this.props.updateSelectedGroupId(-1)
                                this.props.updateViewCategory(ViewCategory.AllStatements)
                                this.props.updateViewState(ViewState.AllStatementVotes)
                            }}
                            target={ArrowButtonTarget.Group}
                            direction={ArrowButtonDirection.Previous}
                        ></ArrowButton>
                    )}
                    {this.props.gid !== 0 && (
                        <ArrowButton
                            overrideDisabled={this.props.gid - 1 < 0}
                            target={ArrowButtonTarget.Group}
                            direction={ArrowButtonDirection.Previous}
                        ></ArrowButton>
                    )}
                </div>

                <div className="w-3/4 mx-auto overflow-y-auto">
                    <h1 className={'mt-6'}>
                        Stemgedrag Groep {globals.groupLabels[this.props.gid]} op alle stellingen
                    </h1>
                    <Tag>Aantal deelnemers: {this.getNumParticipantsOfGroup()}</Tag>
                    {this.state.commentsWithGroupVotes && (
                        <Tag>Aantal stellingen: {this.state.commentsWithGroupVotes.length}</Tag>
                    )}

                    {this.state.commentsWithGroupVotes && (
                        <div className="mt-4">
                            <CommentList
                                conversation={this.props.conversation}
                                math={this.props.math}
                                tidsToRender={this.state.commentsWithGroupVotes.map((c) => c.tid)}
                                comments={this.state.commentsWithGroupVotes}
                                voteColors={this.state.groupVoteColors}
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <ArrowButton
                        overrideDisabled={this.props.gid + 1 >= this.getNumberOfGroups()}
                        target={ArrowButtonTarget.Group}
                        direction={ArrowButtonDirection.Next}
                    ></ArrowButton>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(allCommentsForGroup)
