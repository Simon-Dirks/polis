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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

class StackedBarChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentsWithExtremity: null,
            data: null,
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
                    },
                },
                onHover: (event, elements) => {
                    if (elements.length > 0) {
                        const datasetIndex = elements[0].datasetIndex
                        const slotIndex = elements[0].index

                        const isValidIndex =
                            datasetIndex >= 0 &&
                            datasetIndex < this.state.data.datasets.length &&
                            slotIndex >= 0 &&
                            slotIndex < this.state.data.datasets[datasetIndex].data.length

                        if (isValidIndex) {
                            const comment =
                                this.state.data.datasets[datasetIndex].comments[slotIndex]
                            console.log(comment)
                        }
                    }
                },
            },
        }
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
        const numSlots = 10

        const slotWidth = (maxExtremity - minExtremity) / numSlots

        const slots = new Array(numSlots).fill(null).map(() => [])

        commentsWithExtremity.forEach((comment) => {
            const extremity = comment.extremity
            if (extremity >= minExtremity && extremity <= maxExtremity) {
                const slotIndex = Math.min(
                    Math.floor((extremity - minExtremity) / slotWidth),
                    numSlots - 1
                )
                // TODO: Save additional comment data here, and use it later on
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

                const barSize = slotComment === undefined ? 0 : 50
                datasets[slotCommentIdx].push({ barSize: barSize, comment: slotComment })
            }

            // console.log(slotIndex, slotComments)
        }

        datasets = datasets.map((layerSlotsData, layerIdx) => {
            const layerBarSizes = layerSlotsData.map((d) => d.barSize)
            const layerComments = layerSlotsData.map((d) => d.comment)

            // TODO: Retrieve what group this statement belongs to, use that to edit background color

            // Start at bottom layer, then second stacked layer on top of that, then next layer, etc.
            return {
                label: 'Layer ' + layerIdx,
                data: layerBarSizes,
                comments: layerComments,
                backgroundColor: 'purple',
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
            <div className={'w-[960px]'}>
                {this.state.data && <Bar options={this.state.options} data={this.state.data} />}
            </div>
        )
    }
}

export default StackedBarChart
