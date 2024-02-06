import React, { Component } from 'react'
import * as d3 from 'd3'

class VarianceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numRows: 4, // Number of rows
            numCirclesPerRow: 15, // Number of circles per row
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

    handleResize = () => {
        this.createSVG()
    }

    calculateRadius = (width, numCirclesPerRow, padding) => {
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

        for (let row = 0; row < this.state.numRows; row++) {
            for (let i = 0; i < this.state.numCirclesPerRow; i++) {
                circlesData.push({ row, index: i })
            }
        }

        const padding = this.state.padding - 1 // quick fix for making sure the very far right pixel of a circle is not cut off

        svg.selectAll('circle')
            .data(circlesData)
            .enter()
            .append('circle')
            .attr('cx', (d) => (d.index + 0.5) * (circleRadius * 2 + padding))
            .attr('cy', (d) => (d.row + 0.5) * (circleRadius * 2 + padding))
            .attr('r', circleRadius)
            .attr('fill', 'steelblue')
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
