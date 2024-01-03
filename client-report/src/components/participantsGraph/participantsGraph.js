// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import _ from 'lodash'
import * as globals from '../globals'
import graphUtil from '../../util/graphUtil'
import * as d3contour from 'd3-contour'
import * as d3chromatic from 'd3-scale-chromatic'
// import GroupLabels from "./groupLabels";
import Comments from '../commentsGraph/comments'
import Hull from './hull'
import CommentList from '../lists/commentList'
import Participants from './participants'
import GroupColorLegend from '../controls/groupColorLegend'

const pointsPerSquarePixelMax = 0.0017 /* choose dynamically ? */
const contourBandwidth = 20
const colorScaleDownFactor = 0.5 /* The colors are too dark. This helps. */

const color = d3.scaleSequential(d3chromatic.interpolateYlGnBu).domain([0, pointsPerSquarePixelMax])
const geoPath = d3.geoPath()

const Contour = ({ contour }) => (
    <path fill={color(contour.value * colorScaleDownFactor)} d={geoPath(contour)} />
)

class ParticipantsGraph extends React.Component {
    constructor(props) {
        super(props)
        this.Viewer = null
        this.state = {
            selectedComment: null,
            showContour: false,
            showGroupLabels: true,
            showParticipants: props.showParticipants,
            showGroupOutline: true,
            showComments: props.showComments,
            showAxes: false,
            showRadialAxes: false,
            selfPid: null,
        }
    }

    componentDidMount() {
        window.addEventListener('message', this.handleMessage)
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleMessage)
    }

    handleMessage = (event) => {
        if (!event.data) {
            return
        }
        const ptptoisProjected = event.data.ptptoisProjected
        if (ptptoisProjected === undefined) {
            return
        }
        const selfPtpt = ptptoisProjected.find((ptpt) => ptpt.isSelf)
        if (!selfPtpt) {
            return
        }
        this.setState({ selfPid: selfPtpt?.pid })
    }

    handleCommentClick(selectedComment) {
        return () => {
            this.setState({ selectedComment })
        }
    }

    getInnerRadialAxisColor() {
        let color = globals.brandColors.lightgrey
        if (this.props.consensusDivisionColorScale && this.props.colorBlindMode) {
            color = globals.brandColors.blue
        } else if (this.props.consensusDivisionColorScale && !this.props.colorBlindMode) {
            color = this.props.voteColors.agree
        }
        return color
    }

    render() {
        if (!this.props.math) {
            return null
        }

        const {
            xx,
            yy,
            commentsPoints,
            xCenter,
            yCenter,
            baseClustersScaled,
            commentScaleupFactorX,
            commentScaleupFactorY,
            hulls,
        } = graphUtil(this.props.comments, this.props.math, this.props.badTids)

        const contours = d3contour
            .contourDensity()
            .x(function (d) {
                return d.x
            })
            .y(function (d) {
                return d.y
            })
            .size([globals.side, globals.side])
            // .bandwidth(10)(baseClustersScaled)
            .bandwidth(contourBandwidth)(baseClustersScaled)

        return (
            <>
                <GroupColorLegend math={this.props.math} />
                <div style={{ position: 'relative' }}>
                    {/*{this.props.renderHeading && (*/}
                    {/*    <div>*/}
                    {/*        <h1>Participants overview</h1>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    <div className={'hidden'}>
                        {
                            // <button
                            //   style={{
                            //     color: this.state.showContour ? "white" : "black",
                            //     border: this.state.showContour ? "1px solid #03A9F4" : "1px solid black",
                            //     cursor: "pointer",
                            //     borderRadius: 3,
                            //     background: this.state.showContour ? "#03A9F4" : "none",
                            //     padding: 4,
                            //     marginRight: 20
                            //   }}
                            //   onClick={() => { this.setState({
                            //     showContour: !this.state.showContour,
                            //     consensusDivisionColorScale: false
                            //   })
                            //   }}>
                            //   Density
                            // </button>
                        }
                        <button
                            style={{
                                color: this.state.showAxes ? 'white' : 'black',
                                border: this.state.showAxes
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showAxes ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({ showAxes: !this.state.showAxes })
                            }}
                        >
                            Axes
                        </button>
                        <button
                            style={{
                                color: this.state.showRadialAxes ? 'white' : 'black',
                                border: this.state.showRadialAxes
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showRadialAxes ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({
                                    showRadialAxes: !this.state.showRadialAxes,
                                })
                            }}
                        >
                            Radial axes
                        </button>
                        {/* <button
            style={{
              color: this.state.consensusDivisionColorScale ? "white" : "black",
              border: this.state.consensusDivisionColorScale ? "1px solid #03A9F4" : "1px solid black",
              cursor: "pointer",
              borderRadius: 3,
              background: this.state.consensusDivisionColorScale ? "#03A9F4" : "none",
              padding: 4,
              marginRight: 20
            }}
            onClick={() => { this.setState({
              consensusDivisionColorScale: !this.state.consensusDivisionColorScale,
              showContour: false
            }) }}>
            Consensus / Divisive color scale
          </button>*/}
                        <button
                            style={{
                                color: this.state.showComments ? 'white' : 'black',
                                border: this.state.showComments
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showComments ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({ showComments: !this.state.showComments })
                            }}
                        >
                            Statements
                        </button>
                        <button
                            style={{
                                color: this.state.showParticipants ? 'white' : 'black',
                                border: this.state.showParticipants
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showParticipants ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({ showParticipants: !this.state.showParticipants })
                            }}
                        >
                            Participants (bucketized)
                        </button>
                        <button
                            style={{
                                color: this.state.showGroupOutline ? 'white' : 'black',
                                border: this.state.showGroupOutline
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showGroupOutline ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({ showGroupOutline: !this.state.showGroupOutline })
                            }}
                        >
                            Group outline
                        </button>
                        <button
                            style={{
                                color: this.state.showGroupLabels ? 'white' : 'black',
                                border: this.state.showGroupLabels
                                    ? '1px solid #03A9F4'
                                    : '1px solid black',
                                cursor: 'pointer',
                                borderRadius: 3,
                                background: this.state.showGroupLabels ? '#03A9F4' : 'none',
                                padding: 4,
                                marginRight: 20,
                            }}
                            onClick={() => {
                                this.setState({ showGroupLabels: !this.state.showGroupLabels })
                            }}
                        >
                            Group labels
                        </button>
                    </div>

                    {this.state.selectedComment ? (
                        <div style={{ paddingTop: '30px', paddingBottom: '10px' }}>
                            <CommentList
                                conversation={this.props.conversation}
                                ptptCount={this.props.ptptCount}
                                math={this.props.math}
                                formatTid={this.props.formatTid}
                                tidsToRender={[this.state.selectedComment.tid]}
                                comments={this.props.comments}
                                voteColors={this.props.voteColors}
                            />
                        </div>
                    ) : (
                        <></>
                    )}

                    {this.state.showParticipants
                        ? null
                        : // <p style={globals.paragraph}>
                          //     {hulls.map((h, i) => {
                          //         return (
                          //             <span style={{ marginRight: 40 }} key={i}>
                          //                 {`${globals.groupSymbols[i]}`}
                          //                 <span
                          //                     style={{
                          //                         fontFamily:
                          //                             '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
                          //                     }}
                          //                 >
                          //                     {' '}
                          //                     {`${globals.groupLabels[i]}`}{' '}
                          //                 </span>
                          //             </span>
                          //         )
                          //     })}
                          // </p>
                          null}
                    <svg
                        className="shrink-for-print-70 move-left-20-for-print"
                        width={this.props.height ? this.props.height : globals.side}
                        height={this.props.height ? this.props.height : globals.side}
                    >
                        <defs>
                            <radialGradient
                                cx="50%"
                                cy="50%"
                                fx="50%"
                                fy="50%"
                                r="43.818169%"
                                id="radialGradient-1"
                            >
                                <stop stopColor={this.props.voteColors.agree} offset="0%"></stop>
                                <stop
                                    stopColor={globals.brandColors.yellowForRadial}
                                    offset="46.7315051%"
                                ></stop>
                                <stop
                                    stopColor={this.props.voteColors.disagree}
                                    offset="100%"
                                ></stop>
                            </radialGradient>
                            <circle
                                id="path-2"
                                style={{ pointerEvents: 'none' }}
                                cx={xCenter}
                                cy={yCenter}
                                r={globals.side / 2.3}
                            ></circle>
                        </defs>
                        {/*{this.state.showRadialAxes ? (*/}
                        {/*    <g>*/}
                        {/*        <circle*/}
                        {/*            strokeWidth={1}*/}
                        {/*            stroke={'rgb(230,230,230)'}*/}
                        {/*            fill={'rgb(248,248,248)'}*/}
                        {/*            cx={xCenter}*/}
                        {/*            cy={yCenter}*/}
                        {/*            r={globals.side / 2.3}*/}
                        {/*        />*/}
                        {/*        <circle*/}
                        {/*            strokeWidth={1}*/}
                        {/*            stroke={'rgb(230,230,230)'}*/}
                        {/*            fill={'rgb(245,245,245)'}*/}
                        {/*            cx={xCenter}*/}
                        {/*            cy={yCenter}*/}
                        {/*            r={globals.side / 4}*/}
                        {/*        />*/}
                        {/*        <circle*/}
                        {/*            strokeWidth={1}*/}
                        {/*            stroke={'rgb(230,230,230)'}*/}
                        {/*            fill={'rgb(248,248,248)'}*/}
                        {/*            cx={xCenter}*/}
                        {/*            cy={yCenter}*/}
                        {/*            r={globals.side / 8}*/}
                        {/*        />*/}
                        {/*    </g>*/}
                        {/*) : null}*/}
                        {this.state.showContour
                            ? contours.map((contour, i) => <Contour key={i} contour={contour} />)
                            : null}
                        {/*{this.state.showAxes ? (*/}
                        {/*    <Axes xCenter={xCenter} yCenter={yCenter} report={this.props.report} />*/}
                        {/*) : null}*/}
                        {this.state.showGroupOutline
                            ? hulls.map((hull) => {
                                  let gid = hull.group[0].gid
                                  if (_.isNumber(this.props.showOnlyGroup)) {
                                      if (gid !== this.props.showOnlyGroup) {
                                          return ''
                                      }
                                  }
                                  return <Hull key={gid} hull={hull} gid={gid} />
                              })
                            : null}
                        {this.state.showParticipants ? (
                            <Participants
                                math={this.props.math}
                                points={baseClustersScaled}
                                selfPid={this.state.selfPid}
                            />
                        ) : null}
                        {this.state.showComments ? (
                            <Comments
                                {...this.props}
                                handleClick={this.handleCommentClick.bind(this)}
                                parentGraph={'contour'}
                                points={commentsPoints}
                                xx={xx}
                                yy={yy}
                                xCenter={xCenter}
                                yCenter={yCenter}
                                xScaleup={commentScaleupFactorX}
                                yScaleup={commentScaleupFactorY}
                            />
                        ) : null}
                        {this.state.showGroupLabels
                            ? this.props.math['group-clusters'].map((g, i) => {
                                  // console.log('g',g )
                                  return (
                                      <text
                                          key={i}
                                          transform={`translate(
                        ${xx(g.center[0])},
                        ${yy(g.center[1])}
                      )`}
                                          style={{
                                              fill: 'rgba(0,0,0,.5)',
                                              fontFamily: 'Helvetica',
                                              fontWeight: 700,
                                              fontSize: 18,
                                          }}
                                      >
                                          {globals.groupLabels[g.id]}
                                      </text>
                                  )
                              })
                            : null}
                        {this.state.consensusDivisionColorScale ? (
                            <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                            >
                                <g id="Artboard-Copy-4">
                                    <g id="Oval">
                                        <use
                                            fill="url(#radialGradient-1)"
                                            fillRule="evenodd"
                                            style={{
                                                mixBlendMode: 'color-burn',
                                            }}
                                            xlinkHref="#path-2"
                                        ></use>
                                        <use
                                            stroke="none"
                                            strokeWidth="1"
                                            xlinkHref="#path-2"
                                        ></use>
                                    </g>
                                </g>
                            </g>
                        ) : null}
                    </svg>
                </div>
            </>
        )
    }
}

export default ParticipantsGraph
