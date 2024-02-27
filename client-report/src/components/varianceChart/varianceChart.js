import React, { Component } from 'react'
import * as d3 from 'd3'
import DataUtils from '../../util/dataUtils'
import PercentageVotesBlocks from './percentageVotesBlocks'
import CommentContent from './commentContent'
import HorizontalVarianceAxis from './horizontalVarianceAxis'
import closeIcon from '../../assets/close.svg'
import VerticalVarianceAxis from './verticalVarianceAxis'
import scrollIntoView from 'scroll-into-view-if-needed'

const circleColor = '#D9D9D9'
const circleColorOnHover = '#929292'

const timeForHoverAnimationInMs = 100
// const timeForIntroAnimationInMs = 750
// const delayBetweenCirclesInMs = 0 // TODO: Adjust this based on number of total circles? Configure total animation time based on this

const minCirclesPerRowForCalculatingRadius = 6 // Used to determine radius of circles on mobile
const minVotesForCommentToShow = 7

class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numCirclesPerRow: 36,
            paddingPx: 3,
            selectedComment: undefined,
            introAnimationCompleted: false,
            svgWidth: 0,
            hasSelectedRandomComment: false,
        }
        this.svgRef = React.createRef()
        this.svgRefContainer = React.createRef()
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        this.createSVG()

        this.resizeObserverContainer = new ResizeObserver(this.handleResize)
        this.resizeObserverContainer.observe(this.svgRefContainer.current)

        // setTimeout(() => {
        //     this.resizeObserver = new ResizeObserver(this.handleResize)
        //     this.resizeObserver.observe(this.svgRef.current)
        // }, timeForIntroAnimationInMs * 2)
    }

    componentWillUnmount() {
        if (this.resizeObserverContainer) {
            this.resizeObserverContainer.disconnect()
        }
    }

    selectRandomComment() {
        console.log('Selecting random comment')
        const allCircles = d3.selectAll('circle')
        const numCircles = allCircles.size()
        const randomIndex = Math.floor(Math.random() * numCircles)
        const randomCircle = allCircles.nodes()[randomIndex]
        d3.select(randomCircle).dispatch('click')
    }

    handleResize() {
        // console.log('HANDLING RESIZE')

        this.removeAllCircles()
        this.createSVG(false)
    }

    isMobile() {
        return window.innerWidth <= 768
    }

    calculateRadius(width, height, numCirclesPerRow, numRows, padding) {
        if (numCirclesPerRow < minCirclesPerRowForCalculatingRadius) {
            numCirclesPerRow = minCirclesPerRowForCalculatingRadius
        }
        const maxWidthRadius = (width - (numCirclesPerRow - 1) * padding) / (numCirclesPerRow * 2)
        const maxHeightRadius = (height - (numRows - 1) * padding) / (numRows * 2)

        if (this.isMobile()) {
            // On mobile, maximize for width, and allow scrolling vertically
            return maxWidthRadius
        }

        return Math.min(maxWidthRadius, maxHeightRadius)
    }

    initCircleSelect(svg, animate) {
        const that = this

        const onCircleSelect = function (circleData, circleElem, isHoverEvent) {
            if (animate && !that.state.introAnimationCompleted) {
                return
            }
            console.log('SELECTING CIRCLE', circleData, circleElem, isHoverEvent)
            that.setState({ selectedComment: circleData.comment })

            that.deselectAllCircles()

            d3.select(circleElem)
                .transition()
                .duration(timeForHoverAnimationInMs)
                .attrTween('fill', function () {
                    const startColor = d3.rgb(circleColor)
                    const endColor = d3.rgb(circleColorOnHover)
                    return function (t) {
                        return d3.interpolate(startColor, endColor)(t)
                    }
                })

            if (!isHoverEvent) {
                // TODO: Do not use timeout here (used to wait for popup at bottom to show up)

                setTimeout(() => {
                    scrollIntoView(circleElem, {
                        // scrollMode: 'if-needed',
                        block: 'center',
                        inline: 'nearest',
                        behavior: 'smooth',
                    })
                    // circleElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 10)
            }
        }

        if (that.isMobile()) {
            svg.selectAll('circle').on('click', function (e) {
                onCircleSelect(e, this, false)
            })
        } else {
            svg.selectAll('circle').on('click', function (e) {
                onCircleSelect(e, this, false)
            })
            // svg.selectAll('circle')
            //     .on('mouseover', function (e) {
            //         onCircleSelect(e, this, true)
            //     })
            //     .on('mouseout', function () {
            //         that.deselectCircle(d3.select(this))
            //         // that.setState({ selectedComment: undefined })
            //     })
        }
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

        let minPercentageDiff = Infinity
        let maxPercentageDiff = 0
        const commentsWithPercentageDiff = comments.map((comment) => {
            const percentageDiff = DataUtils.calculatePercentageDifference(
                comment.agreed,
                comment.disagreed
            )
            comment.percentageDiff = percentageDiff
            // console.log(comment.agreed, comment.disagreed, comment.percentageDiff)
            minPercentageDiff =
                percentageDiff < minPercentageDiff ? percentageDiff : minPercentageDiff
            maxPercentageDiff =
                percentageDiff > maxPercentageDiff ? percentageDiff : maxPercentageDiff

            comment.passed = comment.saw - comment.agreed - comment.disagreed

            return comment
        })

        const numSlots = this.state.numCirclesPerRow
        const slotWidth = (maxPercentageDiff - minPercentageDiff) / numSlots
        const slots = new Array(numSlots).fill(null).map(() => [])

        // TODO: Ensure that the circles always fill the first and last slots (corresponding to min and max percentage diffs)
        let maxSlotItems = 0
        commentsWithPercentageDiff.forEach((comment) => {
            const percentageDiff = maxPercentageDiff - comment.percentageDiff
            if (percentageDiff >= minPercentageDiff && percentageDiff <= maxPercentageDiff) {
                const slotIndex = Math.min(
                    Math.floor((percentageDiff - minPercentageDiff) / slotWidth),
                    numSlots - 1
                )
                slots[slotIndex].push(comment)
                const numSlotItems = slots[slotIndex].length

                maxSlotItems = numSlotItems > maxSlotItems ? numSlotItems : maxSlotItems
            }
        })

        slots.map((slotItems) => {
            return slotItems.sort((a, b) => {
                return a.percentageDiff < b.percentageDiff
            })
        })

        for (let slotColIdx = 0; slotColIdx < this.state.numCirclesPerRow; slotColIdx++) {
            const slotItems = slots[slotColIdx]
            for (let slotRowIdx = 0; slotRowIdx < slotItems.length; slotRowIdx++) {
                const slotItem = slotItems[slotRowIdx]
                // console.log(slotRowIdx, slotColIdx, slotItem.percentageDiff)
                circlesData.push({
                    row: slotRowIdx,
                    index: slotColIdx,
                    comment: slotItem,
                })
            }
        }

        return [circlesData, maxSlotItems]
    }

    deselectCircle(c) {
        c.transition()
            .duration(timeForHoverAnimationInMs)
            .attrTween('fill', function () {
                const startColor = d3.color(d3.select(this).attr('fill')) || d3.rgb(circleColor)
                const endColor = d3.rgb(circleColor)
                return (t) => d3.interpolate(startColor, endColor)(t)
            })
    }

    deselectAllCircles() {
        const svg = d3.select(this.svgRef.current)
        this.deselectCircle(svg.selectAll('circle'))
    }

    removeAllCircles() {
        const svg = d3.select(this.svgRef.current)
        svg.selectAll('circle').remove()
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

        // const circles = this.initCircles(svg, circlesData, circleRadius)
        this.initCircles(svg, circlesData, circleRadius)

        // if (animate) {
        //     this.initCircleIntroAnimation(circles, circleRadius)
        // }

        this.initCircleSelect(svg, animate)

        let contentWidth = this.state.numCirclesPerRow * (2 * circleRadius + this.state.paddingPx)
        if (contentWidth < 0) {
            contentWidth = 0
        }
        let contentHeight = '100%'
        if (isMobile) {
            const contentHeightPx =
                this.state.numCirclesPerRow * (2 * circleRadius + this.state.paddingPx)
            contentHeight = `${contentHeightPx}px`
            this.setState({ svgHeight: contentHeightPx })
        }
        this.setState({ svgWidth: contentWidth })

        // container.style.width = `${contentWidth}px`
        svg.attr('width', `${contentWidth}px`).attr('height', contentHeight)

        // TODO: Wait for all circles to be drawn to the screen, now sometimes does not select. Remove delay.
        if (!this.state.hasSelectedRandomComment && !this.isMobile()) {
            this.setState({ hasSelectedRandomComment: true })
            setTimeout(() => {
                this.selectRandomComment()
            }, 200)
        }
    }

    render() {
        return (
            <div className="flex flex-col w-full h-full">
                {/* DESKTOP COMMENT DETAILS */}
                <div
                    className="flex-grow-0 hidden md:flex mx-20"
                    style={{ visibility: this.state.selectedComment ? 'visible' : 'hidden' }}
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

                {/* SVG */}
                <div
                    className="flex-grow md:mb-20 pt-4 md:pt-0"
                    style={{ overflowY: this.isMobile() ? 'auto' : 'initial' }}
                    onClick={(e) => {
                        const clickedOnCircle = e.target?.tagName.toLowerCase() === 'circle'
                        if (this.isMobile() && !clickedOnCircle) {
                            this.setState({ selectedComment: undefined })
                            this.deselectAllCircles()
                        }
                    }}
                    id={'svg-scroll-container'}
                >
                    <div
                        className="max-w-full md:h-full mx-16 md:mx-0 relative"
                        ref={this.svgRefContainer}
                    >
                        <svg
                            ref={this.svgRef}
                            className="mb-16 md:mb-0"
                            style={{ maxWidth: '100%' }}
                        ></svg>

                        <VerticalVarianceAxis height={this.state.svgHeight} />
                        <HorizontalVarianceAxis width={this.state.svgWidth} />
                    </div>
                </div>

                {/* MOBILE COMMENT DETAILS */}
                <div
                    className="md:!hidden border-t border-t-kennislink-light-gray p-6 relative z-20"
                    style={{ display: this.state.selectedComment ? 'block' : 'none' }}
                >
                    <>
                        <button
                            className={'absolute top-4 right-4'}
                            onClick={() => {
                                this.setState({ selectedComment: undefined })
                            }}
                        >
                            <img src={closeIcon} alt="close icon" />
                        </button>
                        <div className="mb-4">
                            <PercentageVotesBlocks comment={this.state.selectedComment} />
                        </div>
                        <CommentContent comment={this.state.selectedComment} />
                    </>
                </div>
            </div>
        )
    }
}

export default VarianceChart
