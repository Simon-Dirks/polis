// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
import CommentList from './commentList'
import * as globals from '../globals'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedParticipantId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'
import { ViewCategory, ViewState } from '../../models/viewState'

function sortByTid(comments) {
    return _.map(comments, (comment) => comment.tid).sort((a, b) => a - b)
}

function sortByVoteCount(comments) {
    return _.map(_.reverse(_.sortBy(comments, 'count')), (c) => {
        return c.tid
    })
}

function sortByGroupAwareConsensus(comments) {
    return _.map(
        _.reverse(
            _.sortBy(comments, (c) => {
                return c['group-aware-consensus']
            })
        ),
        (c) => {
            return c.tid
        }
    )
}

function sortByPctAgreed(comments) {
    return _.map(
        _.reverse(
            _.sortBy(comments, (c) => {
                return c['pctAgreed']
            })
        ),
        (c) => {
            return c.tid
        }
    )
}

function sortByPctDisagreed(comments) {
    return _.map(
        _.reverse(
            _.sortBy(comments, (c) => {
                return c['pctDisagreed']
            })
        ),
        (c) => {
            return c.tid
        }
    )
}

function sortByPctPassed(comments) {
    return _.map(
        _.reverse(
            _.sortBy(comments, (c) => {
                return c['pctPassed']
            })
        ),
        (c) => {
            return c.tid
        }
    )
}

class allCommentsModeratedIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortStyle: globals.allCommentsSortDefault,
        }
    }

    onSortChanged(event) {
        this.setState({
            sortStyle: event.target.value,
        })
    }

    render() {
        if (!this.props.conversation) {
            return <div>Loading allCommentsModeratedIn...</div>
        }

        let sortFunction = null
        if (this.state.sortStyle === 'tid') {
            sortFunction = sortByTid
        } else if (this.state.sortStyle === 'numvotes') {
            sortFunction = sortByVoteCount
        } else if (this.state.sortStyle === 'consensus') {
            sortFunction = sortByGroupAwareConsensus
        } else if (this.state.sortStyle === 'pctAgreed') {
            sortFunction = sortByPctAgreed
        } else if (this.state.sortStyle === 'pctDisagreed') {
            sortFunction = sortByPctDisagreed
        } else if (this.state.sortStyle === 'pctPassed') {
            sortFunction = sortByPctPassed
        } else {
            console.error('missing sort function', this.state.sortStyle)
        }

        return (
            <div>
                <h1>
                    Stemgedrag{' '}
                    <button
                        onClick={() => {
                            this.props.updateViewCategory(ViewCategory.Home)
                            this.props.updateViewState(ViewState.ParticipantsGraph)
                        }}
                        className={'underline'}
                    >
                        alle deelnemers
                    </button>{' '}
                    ({this.props.ptptCount}) op alle stellingen ({this.props.comments?.length})
                </h1>

                <label htmlFor="allCommentsSortMode">Sort by: </label>
                <select
                    id="allCommentsSortMode"
                    onChange={this.onSortChanged.bind(this)}
                    value={this.state.sortStyle}
                >
                    {/*<option value="tid">Statement Id</option>*/}
                    <option value="consensus">Group-informed Consensus</option>
                    <option value="numvotes">Number of votes</option>
                    <option value="pctAgreed">% Agreed</option>
                    <option value="pctDisagreed">% Disagreed</option>
                    <option value="pctPassed">% Passed</option>
                </select>

                <div>
                    <CommentList
                        conversation={this.props.conversation}
                        ptptCount={this.props.ptptCount}
                        math={this.props.math}
                        formatTid={this.props.formatTid}
                        tidsToRender={sortFunction(this.props.comments)}
                        comments={this.props.comments}
                        voteColors={this.props.voteColors}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, {
    updateSelectedParticipantId,
    updateViewState,
    updateViewCategory,
})(allCommentsModeratedIn)
