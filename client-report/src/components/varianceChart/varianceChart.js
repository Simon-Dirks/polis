import React, { Component } from 'react'
import * as d3 from 'd3'

const circleColor = '#D9D9D9'
const circleColorOnHover = '#929292'

const timeForHoverAnimationInMs = 250
const timeForIntroAnimationInMs = 750
const delayBetweenCirclesInMs = 3 // TODO: Adjust this based on number of total circles? Configure total animation time based on this

class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numRows: 4, // Number of rows
            numCirclesPerRow: 36, // Number of circles per row
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
                that.setState({ selectedComment: circleData.text })
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

        return svg
            .selectAll('circle')
            .data(circlesData)
            .enter()
            .append('circle')
            .attr('cx', (d) => (d.index + 0.5) * (circleRadius * 2 + padding))
            .attr('cy', (d) => (d.row + 0.5) * (circleRadius * 2 + padding))
            .attr('r', circleRadius)
            .attr('fill', '#D9D9D9')
    }

    createSVG(animate = true) {
        const svg = d3.select(this.svgRef.current)
        const container = svg.node().parentElement
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        const circleRadius = this.calculateRadius(
            containerWidth,
            containerHeight,
            this.state.numCirclesPerRow,
            this.state.numRows,
            this.state.padding
        )

        svg.selectAll('circle').remove()

        svg.attr('width', '100%').attr('height', '100%')

        const circlesData = []

        for (let colIdx = 0; colIdx < this.state.numCirclesPerRow; colIdx++) {
            for (let rowIdx = this.state.numRows - 1; rowIdx >= 0; rowIdx--) {
                circlesData.push({
                    row: rowIdx,
                    index: colIdx,
                    text: 'fdkjsalfj' + Math.random().toString(),
                })
            }
        }

        const circles = this.initCircles(svg, circlesData, circleRadius)

        if (animate) {
            this.initCircleIntroAnimation(circles, circleRadius)
        }

        this.initCircleHover(svg, animate)
    }
    render() {
        return (
            <div className="flex flex-col w-full h-full">
                <div className="flex-grow pb-8">
                    {this.state.selectedComment && <p>{this.state.selectedComment}</p>}
                </div>

                <div className="flex-grow">
                    <svg ref={this.svgRef} className="w-full h-full"></svg>
                </div>
            </div>
        )
    }
}

export default VarianceChart
