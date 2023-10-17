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

const options = {
    plugins: {
        title: {
            display: false,
        },
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
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
}

class StackedBarChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentsWithExtremity: null,
            data: null,
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
                // TODO: Save additional comment data here, and use it later on
                slots[slotIndex].push(comment.txt)
            }
        })

        let datasets = []
        const maxSlotComments = 3 // TODO: Calculate max number of comments in a single slot
        for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
            const slotComments = slots[slotIndex]

            for (let slotCommentIdx = 0; slotCommentIdx < maxSlotComments; slotCommentIdx++) {
                let slotComment = slotComments[slotCommentIdx]
                if (datasets[slotCommentIdx] === undefined) {
                    datasets[slotCommentIdx] = []
                }

                const barSize = slotComment === undefined ? 0 : 50
                datasets[slotCommentIdx].push(barSize)
            }
        }

        datasets = datasets.map((d, i) => {
            return { label: `DATA ${i}`, data: d, backgroundColor: 'purple' }
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
                {this.state.data && <Bar options={options} data={this.state.data} />}
            </div>
        )
    }
}

export default StackedBarChart
