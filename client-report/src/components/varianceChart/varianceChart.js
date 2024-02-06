import React, { Component } from 'react'
import * as d3 from 'd3'

const circleColor = '#D9D9D9'
const circleColorOnHover = '#929292'
class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numRows: 4, // Number of rows
            numCirclesPerRow: 36, // Number of circles per row
            padding: 5, // Fixed padding between circles
        }
        this.svgRef = React.createRef()
    }

    componentDidMount() {
        this.createSVG()
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize() {
        this.createSVG()
    }

    calculateRadius(width, numCirclesPerRow, padding) {
        const totalPaddingWidth = (numCirclesPerRow - 1) * padding
        return (width - totalPaddingWidth) / (numCirclesPerRow * 2)
    }

    createSVG() {
        const svg = d3.select(this.svgRef.current)
        const container = svg.node().parentElement
        const width = container.clientWidth
        const height = container.clientHeight

        const circleRadius = this.calculateRadius(
            width,
            this.state.numCirclesPerRow,
            this.state.padding
        )

        svg.selectAll('circle').remove()

        svg.attr('width', '100%').attr('height', '100%')

        const circlesData = []

        for (let colIdx = 0; colIdx < this.state.numCirclesPerRow; colIdx++) {
            for (let rowIdx = this.state.numRows - 1; rowIdx >= 0; rowIdx--) {
                circlesData.push({ row: rowIdx, index: colIdx })
            }
        }

        const padding = this.state.padding - 1 // quick fix for making sure the very far right pixel of a circle is not cut off

        const timeForIntroAnimationInMs = 750
        const delayBetweenCirclesInMs = 4
        let introAnimationCompleted = false
        svg.selectAll('circle')
            .data(circlesData)
            .enter()
            .append('circle')
            .attr('cx', (d) => (d.index + 0.5) * (circleRadius * 2 + padding))
            .attr('cy', (d) => (d.row + 0.5) * (circleRadius * 2 + padding))
            .attr('r', circleRadius / 2)
            .attr('fill', '#D9D9D9')
            .attr('opacity', '0')
            .transition()
            .duration(timeForIntroAnimationInMs)
            .delay((d, i) => i * delayBetweenCirclesInMs)
            .attr('r', circleRadius)
            .attr('opacity', '1')
            .on('end', function () {
                introAnimationCompleted = true
            })

        svg.selectAll('circle')
            .on('mouseover', function () {
                if (!introAnimationCompleted) {
                    return
                }
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attrTween('fill', function () {
                        const startColor = d3.rgb(circleColor)
                        const endColor = d3.rgb(circleColorOnHover)
                        return function (t) {
                            return d3.interpolate(startColor, endColor)(t)
                        }
                    })
            })
            .on('mouseout', function () {
                if (!introAnimationCompleted) {
                    return
                }
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attrTween('fill', function () {
                        const startColor = d3.rgb(circleColorOnHover)
                        const endColor = d3.rgb(circleColor)
                        return function (t) {
                            return d3.interpolate(startColor, endColor)(t)
                        }
                    })
            })
    }

    render() {
        return (
            <div className="w-full h-full">
                <svg ref={this.svgRef} className="w-full h-full"></svg>
            </div>
        )
    }
}

export default VarianceChart
