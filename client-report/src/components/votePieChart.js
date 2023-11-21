import React, { useEffect, useRef, useState } from 'react'
// import { Pie } from 'react-chartjs-2'
import { brandColors } from './globals'
import { Chart } from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const VotePieChart = ({
    comment,
    voteCounts,
    sizePx,
    voteColors,
    heading,
    subscript,
    showLabels,
    isRounded,
}) => {
    if (!comment) return null

    const chartCanvasRef = useRef(null)
    const [chartData, setChartData] = useState({})
    const [chart, setChart] = useState(null)
    const [title, setTitle] = useState('')

    // const initChange = () => {}

    useEffect(() => {
        const chartContainer = chartCanvasRef.current
        const ctx = chartContainer.getContext('2d')

        const options = {
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
                datalabels: {
                    formatter: (value, context) => {
                        let voteType = 'Eens'
                        if (context.dataIndex === 1) {
                            voteType = 'Oneens'
                        } else if (context.dataIndex === 2) {
                            voteType = 'Overslaan'
                        }
                        const roundedValue = Math.round(value)
                        if (roundedValue === 0) {
                            return ''
                        }
                        return `${roundedValue}%\n${voteType}`
                    },
                    align: 'start',
                    textAlign: 'center',
                    clamp: true,
                    anchor: 'end',
                    color: 'white',
                    offset: sizePx / 3.5,
                    display: showLabels,
                },
            },
            events: [],
            responsive: false,
            maintainAspectRatio: false,
        }

        setChart(
            new Chart(ctx, {
                plugins: [ChartDataLabels],
                type: 'pie',
                options: options,
            })
        )
    }, [])

    let agrees = 0
    let disagrees = 0
    let sawTheComment = 0
    let missingCounts = false

    let agreeString = ''
    let disagreeString = ''
    let passString = ''

    useEffect(() => {
        if (typeof voteCounts != 'undefined') {
            agrees = voteCounts.A
            disagrees = voteCounts.D
            sawTheComment = voteCounts.S
        } else {
            missingCounts = true
        }

        let passes = sawTheComment - (agrees + disagrees)
        // let totalVotes = agrees + disagrees + passes;

        // const agree = (agrees / nMembers) * w
        // const disagree = (disagrees / nMembers) * w
        // const pass = (passes / nMembers) * w
        // const blank = nMembers - (sawTheComment / nMembers) * w;

        const agreeSaw = (agrees / sawTheComment) * 100
        const disagreeSaw = (disagrees / sawTheComment) * 100
        const passSaw = (passes / sawTheComment) * 100

        agreeString = (agreeSaw << 0) + '%'
        disagreeString = (disagreeSaw << 0) + '%'
        passString = (passSaw << 0) + '%'

        setTitle(
            agreeString +
                ' Agreed\n' +
                disagreeString +
                ' Disagreed\n' +
                passString +
                ' Passed\n' +
                sawTheComment +
                ' Respondents'
        )

        setChartData({
            datasets: [
                {
                    data: [agreeSaw, disagreeSaw, passSaw],
                    backgroundColor: [voteColors.agree, voteColors.disagree, voteColors.pass],
                    borderWidth: 0,
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                    },
                },
            ],
        })
    }, [voteCounts])

    useEffect(() => {
        if (!chart) {
            return
        }
        chart.data = chartData
        chart.update()
    }, [chart, chartData])

    return (
        <div>
            {missingCounts ? (
                <span style={{ fontSize: 12, marginRight: 4, color: 'grey' }}>
                    Missing vote counts
                </span>
            ) : (
                <div
                    className={'flex justify-center items-center overflow-hidden'}
                    style={{
                        height: sizePx + 'px',
                        width: sizePx + 'px',
                        borderRadius: isRounded ? '100%' : 'initial',
                    }}
                >
                    <canvas
                        ref={chartCanvasRef}
                        width={sizePx * 1.5}
                        height={sizePx * 1.5}
                    ></canvas>
                </div>
            )}

            {heading && <p className={'font-bold'}>{heading}</p>}
            {subscript && <p>{subscript}</p>}
        </div>
    )
}

export default VotePieChart
