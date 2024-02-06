import React from 'react'

const PercentageVotesBlock = ({ percentage, label, color }) => {
    const percentageStr = percentage === undefined ? '...' : Math.round(percentage * 100).toString()
    return (
        <div
            className={'rounded-lg px-4 py-2 relative font-inter font-medium mb-2 w-64 '}
            style={{ background: color }}
        >
            <p>
                <span className={'text-8xl'}>{percentageStr}</span>
                <span className={'absolute top-2 text-5xl'}>%</span>
                <span className={'absolute bottom-2 right-4 text-right text-2xl font-normal'}>
                    {label}
                </span>
            </p>
        </div>
    )
}
export default PercentageVotesBlock
