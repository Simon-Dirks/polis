import * as globals from '../globals'
import { ViewState } from '../../models/viewState'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedParticipantId, updateViewState } from '../../store/actions'

const Participants = ({ points, math, selfPid, updateViewState, updateSelectedParticipantId }) => {
    if (!points) {
        return null
    }

    const isClusterHighlighted = (clusterId) => {
        const clusterMembers = math['base-clusters'].members[clusterId]
        if (!clusterMembers || !selfPid) {
            return false
        }

        const selfBelongsToThisCluster = clusterMembers.includes(selfPid)
        return selfBelongsToThisCluster
    }

    const getClusterRadius = (clusterId) => {
        const clusterRadius = Math.sqrt(math['base-clusters'].count[clusterId]) * 8
        if (!clusterId || isNaN(clusterRadius)) {
            return 8
        }
        return clusterRadius
    }

    return (
        <g>
            {points.map((pt, i) => {
                return (
                    <g key={i}>
                        {/*TODO: Allow selection of specific participant in cluster (instead of always selecting first member)*/}
                        <circle
                            r={getClusterRadius(pt.id)}
                            fill={globals.groupColor(pt.gid)}
                            fillOpacity="0.5"
                            cx={pt.x}
                            cy={pt.y}
                            stroke={'black'}
                            strokeWidth={isClusterHighlighted(pt.id) ? 3 : 0}
                            className={'cursor-pointer'}
                            onClick={() => {
                                updateSelectedParticipantId(math['base-clusters'].members[pt.id][0])
                                updateViewState(ViewState.Participant)
                            }}
                        />

                        <text
                            fill={globals.groupColor(pt.gid)}
                            fillOpacity=".5"
                            x={pt.x - 5}
                            y={pt.y + 5}
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
export default connect(mapStateToProps, { updateViewState, updateSelectedParticipantId })(
    Participants
)
