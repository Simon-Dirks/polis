import React from 'react'
import { Pie } from 'react-chartjs-2'
import { brandColors } from './globals'

const VotePieChart = ({ comment, voteCounts, nMembers, voteColors }) => {
    if (!comment) return null

    let w = 100
    let agrees = 0
    let disagrees = 0
    let sawTheComment = 0
    let missingCounts = false

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

    const agreeSaw = (agrees / sawTheComment) * w
    const disagreeSaw = (disagrees / sawTheComment) * w
    const passSaw = (passes / sawTheComment) * w

    const agreeString = (agreeSaw << 0) + '%'
    const disagreeString = (disagreeSaw << 0) + '%'
    const passString = (passSaw << 0) + '%'

    const data = {
        datasets: [
            {
                data: [disagreeSaw, agreeSaw, passSaw],
                backgroundColor: [brandColors.disagree, brandColors.agree, brandColors.pass],
                borderWidth: 0,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                },
            },
        ],
    }

    return (
        <div
            title={
                agreeString +
                ' Agreed\n' +
                disagreeString +
                ' Disagreed\n' +
                passString +
                ' Passed\n' +
                sawTheComment +
                ' Respondents'
            }
        >
            <div>
                {missingCounts ? (
                    <span style={{ fontSize: 12, marginRight: 4, color: 'grey' }}>
                        Missing vote counts
                    </span>
                ) : (
                    <div>
                        <div
                            className={
                                'flex justify-center items-center h-[50px] w-[50px] overflow-hidden'
                            }
                        >
                            <Pie
                                data={data}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    responsive: false,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VotePieChart
