import * as globals from '../globals'
import { ViewCategory, ViewState } from '../../models/viewState'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'

const Participants = ({
    points,
    math,
    selfPid,
    updateViewState,
    updateSelectedParticipantId,
    updateViewCategory,
    updateSelectedGroupId,
}) => {
    if (!points) {
        return null
    }

    const getClusterIdx = (clusterId) => {
        return math['base-clusters'].id.findIndex((cId) => cId === clusterId)
    }
    const isClusterHighlighted = (clusterId) => {
        const clusterIdx = getClusterIdx(clusterId)
        const clusterMembers = math['base-clusters'].members[clusterIdx]
        if (!clusterMembers || !selfPid) {
            return false
        }

        const selfBelongsToThisCluster = clusterMembers.includes(selfPid)
        return selfBelongsToThisCluster
    }

    const getClusterRadius = (clusterId) => {
        const clusterIdx = getClusterIdx(clusterId)

        const clusterRadius = Math.sqrt(math['base-clusters'].count[clusterIdx]) * 8
        if (!clusterId || isNaN(clusterRadius)) {
            return 8
        }
        return clusterRadius
    }

    return (
        <g>
            {points.map((clusterPoint, i) => {
                return (
                    <g key={i}>
                        {/*TODO: Allow selection of specific participant in cluster (instead of always selecting first member)*/}
                        <circle
                            r={getClusterRadius(clusterPoint.id)}
                            fill={globals.groupColor(clusterPoint.gid)}
                            fillOpacity="0.5"
                            cx={clusterPoint.x}
                            cy={clusterPoint.y}
                            stroke={'black'}
                            strokeWidth={isClusterHighlighted(clusterPoint.id) ? 3 : 0}
                            className={'cursor-pointer'}
                            onClick={() => {
                                const clusterIdx = getClusterIdx(clusterPoint.id)
                                updateSelectedGroupId(-1)
                                updateSelectedParticipantId(
                                    math['base-clusters'].members[clusterIdx][0]
                                )
                                updateViewCategory(ViewCategory.AllStatements)
                                updateViewState(ViewState.Participant)
                            }}
                        />

                        <text
                            fill={globals.groupColor(clusterPoint.gid)}
                            fillOpacity=".5"
                            x={clusterPoint.x - 5}
                            y={clusterPoint.y + 5}
                        >
                            {' '}
                            {/*{pt.id} */}
                            {/*{'ID:' +*/}
                            {/*    pt.id +*/}
                            {/*    ' PARTICIPANTS: ' +*/}
                            {/*    math['base-clusters'].count[pt.id] +*/}
                            {/*    ' || IDs: ' +*/}
                            {/*    math['base-clusters'].members[pt.id]}*/}
                            {/*{globals.groupSymbols[pt.gid]}*/}
                        </text>
                    </g>
                )
                // return (<text
                //     key={i}
                //     transform={
                //       `translate(
                //         ${pt.x},
                //         ${pt.y}
                //       )`
                //     }
                //     style={{
                //       fill: "rgba(0,0,0,.5)",
                //       fontSize: 12,
                //     }}
                //     >
                // {globals.groupSymbols[pt.gid]}
                //   </text>)
            })}
        </g>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedParticipantId,
    updateSelectedGroupId,
    updateViewCategory,
})(Participants)
