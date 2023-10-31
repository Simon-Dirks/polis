// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import * as globals from '../globals'
// import Flex from "../framework/flex"
// import style from "../../util/style";
import CommentList from './commentList'
import CommentGrid from './commentGrid'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'

const ParticipantGroup = ({
    gid,
    groupComments,
    conversation,
    comments,
    groupVotesForThisGroup,
    // groupVotesForOtherGroups,
    // demographicsForGroup,
    ptptCount,
    groupName,
    formatTid,
    // groupNames,
    math,
    voteColors,
    updateViewState,
    updateSelectedGroupId,
}) => {
    let groupLabel = groupName
    if (typeof groupLabel === 'undefined') {
        groupLabel = 'Groep ' + globals.groupLabels[gid]
    }

    let groupVoteColors = voteColors
    if (gid < globals.brandColors.groups.length) {
        groupVoteColors = globals.brandColors.groups[gid]
    }

    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    return (
        <div className={'pb-8'}>
            <div className={'grid grid-cols-2'}>
                <button
                    onClick={() => {
                        const newGid = gid - 1
                        if (newGid >= 0) {
                            updateSelectedGroupId(newGid)
                        }
                    }}
                    className={'text-left'}
                >
                    ← Vorige
                </button>

                <button
                    onClick={() => {
                        const newGid = gid + 1
                        if (newGid < getNumberOfGroups()) {
                            updateSelectedGroupId(newGid)
                        }
                    }}
                    className={'text-right'}
                >
                    → Volgende
                </button>
            </div>
            <h1>
                Deze stellingen zijn typerend voor {groupLabel} (
                {groupVotesForThisGroup['n-members']} deelnemers)
            </h1>
            <p className={'mb-8'}>
                <button
                    className={'underline'}
                    onClick={() => {
                        updateSelectedGroupId(gid)
                        updateViewState(ViewState.AllGroupVotes)
                    }}
                >
                    Bekijk het stemgedrag van groep {groupLabel} op alle stellingen
                </button>
            </p>
            <CommentGrid
                conversation={conversation}
                ptptCount={ptptCount}
                math={math}
                formatTid={formatTid}
                tidsToRender={_.map(groupComments, 'tid') /* uncertainTids would be funnier */}
                comments={comments}
                voteColors={groupVoteColors}
            />
        </div>
    )
}
export default connect(mapStateToProps, { updateViewState, updateSelectedGroupId })(
    ParticipantGroup
)
