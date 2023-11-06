// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import _ from 'lodash'
import CommentList from '../lists/commentList'
import DataUtils from '../../util/dataUtils'

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
                        max: 375, // TODO: Calculate and adjust dynamically to maintain square cells
                    },
                },
                onHover: (event, elements) =>
                    this.setState({ hoveredComment: this.getInteractedComment(event, elements) }),
                onClick: (event, elements) => {
                    const interactedComment = this.getInteractedComment(event, elements)
                    if (interactedComment) {
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

    getTidsToRender() {
        if (this.state.hoveredComment) {
            return [this.state.hoveredComment.tid]
        } else if (this.state.selectedComment) {
            return [this.state.selectedComment.tid]
        }
        return []
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

                const barSize = slotComment === undefined ? 0 : 15

                let barColor = '#929292'
                const commentGroupIds = DataUtils.getGroupIdsForComment(
                    slotComment?.tid,
                    this.props.math
                )
                // TODO: Handle comments being in multiple groups (now only showing a single color if a comment is in one group)
                if (commentGroupIds.length > 0) {
                    barColor = '#9C00EA'
                }

                datasets[slotCommentIdx].push({
                    barSize: barSize,
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
                borderWidth: 2,
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
                <div
                    style={{
                        minHeight: '140px',
                        opacity: this.getPreviewCommentOpacity(),
                    }}
                >
                    {(this.state.selectedComment || this.state.hoveredComment) && (
                        <CommentList
                            conversation={this.props.conversation}
                            ptptCount={this.props.ptptCount}
                            math={this.props.math}
                            formatTid={this.props.formatTid}
                            tidsToRender={this.getTidsToRender()}
                            comments={this.props.comments}
                            voteColors={this.props.voteColors}
                        />
                    )}
                </div>

                <div className={'w-[960px]'}>
                    {this.state.data && <Bar options={this.state.options} data={this.state.data} />}
                </div>
                <div className={'w-[960px] pt-2 mt-4 grid grid-cols-2 border-t-2 border-gray-700'}>
                    <p className={'text-left'}>Stellingen met consensus (meerderheidsmening)</p>
                    <p className={'text-right'}>Stellingen met verdeeldheid</p>
                </div>
            </>
        )
    }
}

export default StackedBarChart
