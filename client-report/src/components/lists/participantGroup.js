// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import * as globals from '../globals'
// import Flex from "../framework/flex"
// import style from "../../util/style";
import CommentGrid from './commentGrid'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewState } from '../../store/actions'
import Tag from '../tag'
import GroupColorLegend from '../controls/groupColorLegend'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from '../controls/arrowButton'

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
        <div className={'h-full'}>
            <GroupColorLegend math={math} />

            <div className="h-full flex">
                <div className="flex-1 flex items-center justify-center">
                    <ArrowButton
                        overrideDisabled={gid - 1 < 0}
                        target={ArrowButtonTarget.Group}
                        direction={ArrowButtonDirection.Previous}
                    ></ArrowButton>
                </div>
                <div className="w-3/4 mx-auto overflow-y-auto">
                    <div className="mb-8 mt-6">
                        <h1>De onderstaande stellingen typeren {groupLabel}</h1>
                        <Tag>Aantal deelnemers: {groupVotesForThisGroup['n-members']}</Tag>
                    </div>

                    <div>
                        <CommentGrid
                            conversation={conversation}
                            ptptCount={ptptCount}
                            math={math}
                            formatTid={formatTid}
                            tidsToRender={
                                _.map(groupComments, 'tid') /* uncertainTids would be funnier */
                            }
                            comments={comments}
                            voteColors={groupVoteColors}
                        />
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <ArrowButton
                        overrideDisabled={gid + 1 >= getNumberOfGroups()}
                        target={ArrowButtonTarget.Group}
                        direction={ArrowButtonDirection.Next}
                    ></ArrowButton>
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, { updateViewState, updateSelectedGroupId })(
    ParticipantGroup
)
