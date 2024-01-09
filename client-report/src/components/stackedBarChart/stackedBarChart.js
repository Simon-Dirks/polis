// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import _ from 'lodash'
import DataUtils from '../../util/dataUtils'
import CommentHighlight from '../lists/commentHighlight'
import * as globals from '../globals'
import Color from 'color'
import GroupColorLegend from '../controls/groupColorLegend'
import arrowHeadRight from '../../assets/arrow-head-right.svg'
import arrowHeadLeft from '../../assets/arrow-head-left.svg'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

class StackedBarChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentsWithExtremity: null,
            data: null,
            hoveredComment: null,
            selectedComment: null,
            options: {
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
                colors: {
                    duration: 200,
                },
                // animation: {
                //     duration: 500,
                //     easing: 'easeInOutQuart',
                // },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        display: false,
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        display: false,
                        max: 150, // TODO: Calculate and adjust dynamically to maintain square cells
                    },
                },
                onHover: (event, elements) => {
                    // TODO: Refactor into function(s)
                    const hoveredComment = this.getInteractedComment(event, elements)
                    const isHoveringOverComment = elements.length > 0
                    this.setState({ hoveredComment: hoveredComment })

                    const chart = event.chart
                    const ctx = chart.ctx

                    ctx.save()

                    const chartDatasets = chart.data.datasets
                    for (let datasetIdx = 0; datasetIdx < chartDatasets.length; datasetIdx++) {
                        for (
                            let bgColorIdx = 0;
                            bgColorIdx < chartDatasets[datasetIdx].backgroundColor.length;
                            bgColorIdx++
                        ) {
                            const currentBgColor =
                                chartDatasets[datasetIdx].backgroundColor[bgColorIdx]
                            const transparentColor = Color(currentBgColor).alpha(0.3)
                            const opaqueColor = Color(currentBgColor).alpha(1)
                            const shouldShowTransparent =
                                isHoveringOverComment || this.state.selectedComment
                            chart.data.datasets[datasetIdx].backgroundColor[bgColorIdx] =
                                shouldShowTransparent ? transparentColor.hexa() : opaqueColor.hexa()
                        }
                    }

                    const highlightIndices = []

                    if (isHoveringOverComment) {
                        const hoveredIndices = {
                            datasetIndex: elements[0].datasetIndex,
                            index: elements[0].index,
                            alpha: 0.6,
                        }
                        highlightIndices.push(hoveredIndices)
                    }

                    if (this.state.selectedComment) {
                        const selectedIndices = {
                            datasetIndex: this.state.selectedComment.datasetIndex,
                            index: this.state.selectedComment.index,
                            alpha: 1,
                        }
                        highlightIndices.push(selectedIndices)
                    }

                    for (const highlight of highlightIndices) {
                        const highlightColor = Color(
                            chartDatasets[highlight.datasetIndex].backgroundColor[highlight.index]
                        ).alpha(highlight.alpha)
                        chart.data.datasets[highlight.datasetIndex].backgroundColor[
                            highlight.index
                        ] = highlightColor.hexa()
                    }

                    chart.update()
                    ctx.restore()
                    // this.setState({ data: data })
                },
                onClick: (event, elements) => {
                    const interactedComment = this.getInteractedComment(event, elements)
                    if (interactedComment) {
                        interactedComment.datasetIndex = elements[0].datasetIndex
                        interactedComment.index = elements[0].index

                        this.setState({ selectedComment: interactedComment })
                    }
                },
            },
        }
    }

    getInteractedComment(event, elements) {
        let interactedComment = null
        if (elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex
            const slotIndex = elements[0].index

            const isValidIndex =
                datasetIndex >= 0 &&
                datasetIndex < this.state.data.datasets.length &&
                slotIndex >= 0 &&
                slotIndex < this.state.data.datasets[datasetIndex].data.length

            if (isValidIndex) {
                interactedComment = this.state.data.datasets[datasetIndex].comments[slotIndex]
            }
        }

        return interactedComment
    }

    getCommentToRender() {
        // let tidToRender = null
        if (this.state.hoveredComment) {
            return this.state.hoveredComment
            // tidToRender = this.state.hoveredComment.tid
        } else if (this.state.selectedComment) {
            return this.state.selectedComment
            // tidToRender = this.state.selectedComment.tid
        }
        //
        // if (tidToRender in this.props.comments) {
        //     return this.props.comments[tidToRender]
        // }

        return null
    }

    getPreviewCommentOpacity() {
        const hasHoveredComment = this.state.hoveredComment
        const hoveredCommentIsSelected =
            this.state.hoveredComment?.tid === this.state.selectedComment?.tid
        return !hasHoveredComment || hoveredCommentIsSelected ? 1 : 1
    }

    componentDidMount() {
        if (
            this.props.comments &&
            this.props.extremity &&
            !this.state.commentsWithExtremity /* if we poll, change this so it is auto updating */
        ) {
            this.setup()
        }
    }

    setup() {
        const commentsWithExtremity = []
        _.each(this.props.comments, (comment) => {
            if (this.props.extremity[comment.tid] > 0) {
                const cwe = Object.assign({}, comment, {
                    extremity: this.props.extremity[comment.tid],
                })
                commentsWithExtremity.push(cwe)
            }
        })

        const minExtremity = _.minBy(commentsWithExtremity, 'extremity').extremity
        const maxExtremity = _.maxBy(commentsWithExtremity, 'extremity').extremity

        // TODO: Configure based on design
        const numSlots = 50

        const slotWidth = (maxExtremity - minExtremity) / numSlots

        const slots = new Array(numSlots).fill(null).map(() => [])

        commentsWithExtremity.forEach((comment) => {
            const extremity = comment.extremity
            if (extremity >= minExtremity && extremity <= maxExtremity) {
                const slotIndex = Math.min(
                    Math.floor((extremity - minExtremity) / slotWidth),
                    numSlots - 1
                )
                // console.log(comment)
                slots[slotIndex].push(comment)
            }
        })

        let datasets = []
        const maxSlotComments = _.max(slots.map((slot) => slot.length)) || 0

        for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
            const slotComments = slots[slotIndex]

            for (let slotCommentIdx = 0; slotCommentIdx < maxSlotComments; slotCommentIdx++) {
                let slotComment = slotComments[slotCommentIdx]
                if (datasets[slotCommentIdx] === undefined) {
                    datasets[slotCommentIdx] = []
                }

                const barHeight = slotComment === undefined ? 0 : 6

                let barColor = '#929292'
                const commentGroupIds = DataUtils.getGroupIdsForComment(
                    slotComment?.tid,
                    this.props.math
                )
                // TODO: Handle comments being in multiple groups (now only showing a single color if a comment is in one group)
                if (commentGroupIds.length > 0) {
                    const commentGroupId = commentGroupIds[0]
                    barColor = globals.groupColor(Number(commentGroupId))
                }

                datasets[slotCommentIdx].push({
                    barSize: barHeight,
                    comment: slotComment,
                    barColor: barColor,
                })
            }

            // console.log(slotIndex, slotComments)
        }

        datasets = datasets.map((layerSlotsData, layerIdx) => {
            const layerBarSizes = layerSlotsData.map((d) => d.barSize)
            const layerComments = layerSlotsData.map((d) => d.comment)
            const layerBgColors = layerSlotsData.map((d) => d.barColor)

            // Start at bottom layer, then second stacked layer on top of that, then next layer, etc.
            return {
                label: 'Layer ' + layerIdx,
                data: layerBarSizes,
                comments: layerComments,
                backgroundColor: layerBgColors,
                borderColor: 'white',
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 1,
                // hoverBorderWidth: 3,
            }
        })

        // console.log('DATASETS', datasets)
        const labels = Array.from({ length: numSlots }, (_, index) => `Slot ${index + 1}`)
        const data = {
            labels,
            datasets: datasets,
        }

        this.setState({ data: data })
    }

    render() {
        return (
            <>
                <GroupColorLegend math={this.props.math} />

                <div
                    className={'min-h-[140px] absolute w-[60%] left-[20%] pt-16 z-10'}
                    style={{
                        minHeight: '140px',
                        opacity: this.getPreviewCommentOpacity(),
                    }}
                >
                    {(this.state.selectedComment || this.state.hoveredComment) && (
                        <div>
                            <CommentHighlight
                                comment={this.getCommentToRender()}
                                voteColors={this.props.voteColors}
                                math={this.props.math}
                            ></CommentHighlight>
                        </div>

                        //
                        // <CommentList
                        //     conversation={this.props.conversation}
                        //     ptptCount={this.props.ptptCount}
                        //     math={this.props.math}
                        //     formatTid={this.props.formatTid}
                        //     tidsToRender={this.getTidsToRender()}
                        //     comments={this.props.comments}
                        //     voteColors={this.props.voteColors}
                        // />
                    )}
                </div>

                <div className={'flex relative'}>
                    <div className={'flex-1 flex items-end justify-end pr-6 pb-5'}>
                        <p className={'text-left text-lg'}>Stellingen met consensus</p>
                    </div>

                    <div className={'flex justify-center'}>
                        <div className={'w-[960px]'}>
                            {this.state.data && (
                                <Bar options={this.state.options} data={this.state.data} />
                            )}

                            <div
                                className={
                                    'w-[960px] pt-2 mt-4 grid grid-cols-2 border-t-2 border-black relative'
                                }
                            >
                                <img
                                    src={arrowHeadLeft}
                                    alt="Arrow head left"
                                    className={'absolute top-[-7px] left-[-2px]'}
                                />
                                <img
                                    src={arrowHeadRight}
                                    alt="Arrow head right"
                                    className={'absolute top-[-7px] right-[-2px]'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={'flex-1 flex items-end pl-6 pb-5'}>
                        <p className={'text-right text-lg'}>Stellingen met verdeeldheid</p>
                    </div>
                </div>
            </>
        )
    }
}

export default StackedBarChart
