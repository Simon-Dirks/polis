import React, { Component } from 'react'
import * as d3 from 'd3'
import DataUtils from '../../util/dataUtils'
import PercentageVotesBlock from './percentageVotesBlock'
import Tag from '../tag'

const circleColor = '#D9D9D9'
const circleColorOnHover = '#929292'

const timeForHoverAnimationInMs = 250
const timeForIntroAnimationInMs = 750
const delayBetweenCirclesInMs = 3 // TODO: Adjust this based on number of total circles? Configure total animation time based on this

const minVotesForCommentToShow = 7

class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numCirclesPerRow: 36,
            padding: 3,
            selectedComment: undefined,
            introAnimationCompleted: false,
        }
        this.svgRef = React.createRef()
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        this.createSVG()

        setTimeout(() => {
            this.resizeObserver = new ResizeObserver(this.handleResize)
            this.resizeObserver.observe(this.svgRef.current)
        }, timeForIntroAnimationInMs * 2)
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
    }

    handleResize() {
        this.createSVG(false)
    }

    calculateRadius(width, height, numCirclesPerRow, numRows, padding) {
        const maxWidthRadius = (width - (numCirclesPerRow - 1) * padding) / (numCirclesPerRow * 2)
        const maxHeightRadius = (height - (numRows - 1) * padding) / (numRows * 2)

        return Math.min(maxWidthRadius, maxHeightRadius)
    }

    initCircleHover(svg, animate) {
        const that = this
        svg.selectAll('circle')
            .on('mouseover', function (circleData) {
                if (animate && !that.state.introAnimationCompleted) {
                    return
                }
                that.setState({ selectedComment: circleData.comment })
                d3.select(this)
                    .transition()
                    .duration(timeForHoverAnimationInMs)
                    .attrTween('fill', function () {
                        const startColor = d3.rgb(circleColor)
                        const endColor = d3.rgb(circleColorOnHover)
                        return function (t) {
                            return d3.interpolate(startColor, endColor)(t)
                        }
                    })
            })
            .on('mouseout', function () {
                if (animate && !that.state.introAnimationCompleted) {
                    return
                }

                d3.select(this)
                    .transition()
                    .duration(timeForHoverAnimationInMs)
                    .attrTween('fill', function () {
                        const startColor = d3.rgb(circleColorOnHover)
                        const endColor = d3.rgb(circleColor)
                        return function (t) {
                            return d3.interpolate(startColor, endColor)(t)
                        }
                    })
            })
    }

    initCircleIntroAnimation(circles, radius) {
        circles
            .attr('r', radius / 2)
            .attr('opacity', '0')
            .transition()
            .duration(timeForIntroAnimationInMs)
            .delay((d, i) => i * delayBetweenCirclesInMs)
            .attr('r', radius)
            .attr('opacity', '1')
            .on('end', () => {
                this.setState({ introAnimationCompleted: true })
            })
    }

    initCircles(svg, circlesData, circleRadius) {
        const padding = this.state.padding - 1 // quick fix for making sure the very far right pixel of a circle is not cut off
        const svgHeight = svg.node().getBoundingClientRect().height

        return svg
            .selectAll('circle')
            .data(circlesData)
            .enter()
            .append('circle')
            .attr('cx', (d) => (d.index + 0.5) * (circleRadius * 2 + padding))
            .attr('cy', (d) => svgHeight - (d.row + 0.5) * (circleRadius * 2 + padding))
            .attr('r', circleRadius)
            .attr('fill', '#D9D9D9')
    }

    getCirclesData() {
        const circlesData = []

        let comments = this.props.comments
        if (!comments || comments.length === 0) {
            return []
        }

        comments = comments.filter((comment) => comment.saw >= minVotesForCommentToShow)

        let minVariance = Infinity
        let maxVariance = 0
        const commentsWithVariance = comments.map((comment) => {
            const agreedVotes = new Array(comment.agreed).fill(1)
            const disagreedVotes = new Array(comment.disagreed).fill(-1)
            const commentVotesForVariance = agreedVotes.concat(disagreedVotes)
            const variance = DataUtils.calculateVariance(commentVotesForVariance)
            comment.variance = variance
            minVariance = variance < minVariance ? variance : minVariance
            maxVariance = variance > maxVariance ? variance : maxVariance

            comment.passed = comment.saw - comment.agreed - comment.disagreed

            return comment
        })

        const numSlots = this.state.numCirclesPerRow
        const slotWidth = (maxVariance - minVariance) / numSlots
        const slots = new Array(numSlots).fill(null).map(() => [])

        let maxSlotItems = 0
        commentsWithVariance.forEach((comment) => {
            const variance = comment.variance
            if (variance >= minVariance && variance <= maxVariance) {
                const slotIndex = Math.min(
                    Math.floor((variance - minVariance) / slotWidth),
                    numSlots - 1
                )
                slots[slotIndex].push(comment)
                const numSlotItems = slots[slotIndex].length

                maxSlotItems = numSlotItems > maxSlotItems ? numSlotItems : maxSlotItems
            }
        })

        for (let slotColIdx = 0; slotColIdx < this.state.numCirclesPerRow; slotColIdx++) {
            const slotItems = slots[slotColIdx]
            for (let slotRowIdx = 0; slotRowIdx < slotItems.length; slotRowIdx++) {
                const slotItem = slotItems[slotRowIdx]
                circlesData.push({
                    row: slotRowIdx,
                    index: slotColIdx,
                    comment: slotItem,
                })
            }
        }
        return [circlesData, maxSlotItems]
    }

    createSVG(animate = true) {
        const svg = d3.select(this.svgRef.current)
        const container = svg.node().parentElement
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        const [circlesData, numRows] = this.getCirclesData()

        const circleRadius = this.calculateRadius(
            containerWidth,
            containerHeight,
            this.state.numCirclesPerRow,
            numRows,
            this.state.padding
        )

        svg.selectAll('circle').remove()

        svg.attr('width', '100%').attr('height', '100%')

        const circles = this.initCircles(svg, circlesData, circleRadius)

        if (animate) {
            this.initCircleIntroAnimation(circles, circleRadius)
        }

        this.initCircleHover(svg, animate)
    }
    render() {
        return (
            <div className="flex flex-col w-full h-full">
                <div
                    className="flex-grow-0 pb-8 flex mx-20"
                    style={{ visibility: this.state.selectedComment ? 'visible' : 'hidden' }}
                >
                    <>
                        <div className={'w-64 flex-grow-0'}>
                            <PercentageVotesBlock
                                color={'#0097F6'}
                                backgroundColor={'rgba(0,151,246,0.5)'}
                                percentage={this.state.selectedComment?.pctAgreed}
                                label={'Eens'}
                            />
                            <PercentageVotesBlock
                                color={'#FA3EA4'}
                                backgroundColor={'rgba(250,62,164,0.5)'}
                                percentage={this.state.selectedComment?.pctDisagreed}
                                label={'Oneens'}
                            />
                            <PercentageVotesBlock
                                color={'#FFE63A'}
                                backgroundColor={'rgba(255,230,58,0.5)'}
                                percentage={this.state.selectedComment?.pctVoted}
                                label={'Overslaan'}
                                isLast={true}
                            />
                        </div>
                        <div className={'flex-grow ml-24 flex flex-col justify-center'}>
                            {this.state.selectedComment && (
                                <>
                                    {/*<p>{JSON.stringify(this.state.selectedComment)}</p>*/}
                                    <p className={'font-inter text-2xl'}>
                                        Stelling {this.state.selectedComment?.tid}
                                    </p>
                                    <p className={'font-inter text-5xl font-medium mt-1 mb-6'}>
                                        {this.state.selectedComment?.txt}
                                    </p>
                                    <div className={'mb-4'}>
                                        <Tag>
                                            Aantal stemmen:{' '}
                                            <span className={'font-semibold'}>
                                                {this.state.selectedComment?.saw}
                                            </span>
                                        </Tag>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                </div>

                <div className="flex-grow mb-4">
                    <svg ref={this.svgRef} className="w-full h-full"></svg>
                </div>
            </div>
        )
    }
}

export default VarianceChart
