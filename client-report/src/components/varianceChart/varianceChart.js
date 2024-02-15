import React, { Component } from 'react'
import * as d3 from 'd3'
import DataUtils from '../../util/dataUtils'
import arrowLeft from '../../assets/arrow-left.svg'
import arrowRight from '../../assets/arrow-right.svg'
import PercentageVotesBlocks from './percentageVotesBlocks'
import CommentContent from './commentContent'

const circleColor = '#D9D9D9'
const circleColorOnHover = '#929292'

const timeForHoverAnimationInMs = 250
// const timeForIntroAnimationInMs = 750
// const delayBetweenCirclesInMs = 0 // TODO: Adjust this based on number of total circles? Configure total animation time based on this

const minVotesForCommentToShow = 7

class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numCirclesPerRow: 36,
            paddingPx: 3,
            selectedComment: undefined,
            introAnimationCompleted: false,
        }
        this.svgRef = React.createRef()
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        this.createSVG()

        this.resizeObserver = new ResizeObserver(this.handleResize)
        this.resizeObserver.observe(this.svgRef.current)

        // setTimeout(() => {
        //     this.resizeObserver = new ResizeObserver(this.handleResize)
        //     this.resizeObserver.observe(this.svgRef.current)
        // }, timeForIntroAnimationInMs * 2)
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }
    }

    handleResize() {
        this.createSVG(false)
    }

    isMobile() {
        return window.innerWidth <= 768
    }

    calculateRadius(width, height, numCirclesPerRow, numRows, padding) {
        const maxWidthRadius = (width - (numCirclesPerRow - 1) * padding) / (numCirclesPerRow * 2)
        const maxHeightRadius = (height - (numRows - 1) * padding) / (numRows * 2)

        if (this.isMobile()) {
            // On mobile, maximize for width, and allow scrolling vertically
            return maxWidthRadius
        }

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
    //
    // initCircleIntroAnimation(circles, radius) {
    //     circles
    //         // .attr('r', radius / 2)
    //         .attr('opacity', '0')
    //         .transition()
    //         .duration(timeForIntroAnimationInMs)
    //         .delay((d, i) => i * delayBetweenCirclesInMs)
    //         .attr('r', radius)
    //         .attr('opacity', '1')
    //         .on('end', () => {
    //             this.setState({ introAnimationCompleted: true })
    //         })
    // }

    initCircles(svg, circlesData, circleRadius) {
        const padding = this.state.paddingPx - 1 // quick fix for making sure the very far right pixel of a circle is not cut off
        // const svgWidth = svg.node().getBoundingClientRect().width
        const svgHeight = svg.node().getBoundingClientRect().height

        // Circles from left to right
        let cx = (d) => (d.index + 0.5) * (circleRadius * 2 + padding)
        let cy = (d) => svgHeight - (d.row + 0.5) * (circleRadius * 2 + padding)

        if (this.isMobile()) {
            // Circles from top to bottom
            cx = (d) => (d.row + 0.5) * (circleRadius * 2 + padding)
            cy = (d) => (d.index + 0.5) * (circleRadius * 2 + padding)
        }

        return svg
            .selectAll('circle')
            .data(circlesData)
            .enter()
            .append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
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

        const isMobile = this.isMobile()

        const [circlesData, numRows] = this.getCirclesData()

        const circleRadius = this.calculateRadius(
            containerWidth,
            containerHeight,
            isMobile ? numRows : this.state.numCirclesPerRow,
            isMobile ? this.state.numCirclesPerRow : numRows,
            this.state.paddingPx
        )

        svg.selectAll('circle').remove()

        // const circles = this.initCircles(svg, circlesData, circleRadius)
        this.initCircles(svg, circlesData, circleRadius)

        // if (animate) {
        //     this.initCircleIntroAnimation(circles, circleRadius)
        // }

        this.initCircleHover(svg, animate)

        let contentHeight = '100%'
        if (isMobile) {
            contentHeight = `${
                this.state.numCirclesPerRow * (2 * circleRadius + this.state.paddingPx)
            }px`
        }
        svg.attr('width', '100%').attr('height', contentHeight)
    }

    render() {
        return (
            <div className="flex flex-col w-full h-full">
                <div
                    className="flex-grow-0 pb-8 hidden md:flex mx-20"
                    style={{ visibility: this.state.selectedComment ? 'visible' : 'hidden' }}
                    id={'desktop-comment-info'}
                >
                    <>
                        <div className={'w-64 flex-grow-0'}>
                            <PercentageVotesBlocks comment={this.state.selectedComment} />
                        </div>
                        <div className={'flex-grow ml-24 flex flex-col justify-center'}>
                            <CommentContent comment={this.state.selectedComment} />
                        </div>
                    </>
                </div>

                <div className="flex-grow md:mb-24">
                    <svg ref={this.svgRef} className="w-full mb-16 md:mb-0"></svg>

                    {/*Desktop x-axis*/}
                    <div className={'hidden md:block text-xl relative mt-2'}>
                        <p className={'absolute top-0 left-0'}>
                            <img src={arrowLeft} alt={'Arrow icon'} className={'h-8 mr-2 inline'} />
                            <span>Stellingen met overeenstemming</span>
                        </p>
                        <p className={'absolute top-0 right-0'}>
                            <span>Stellingen met verdeeldheid</span>
                            <img
                                src={arrowRight}
                                alt={'Arrow icon'}
                                className={'h-8 ml-2 inline'}
                            />
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default VarianceChart
