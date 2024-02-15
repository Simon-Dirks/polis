import React from 'react'

const PercentageVotesBlock = ({ percentage, label, color, backgroundColor, isLast }) => {
    const percentageStr = percentage === undefined ? '...' : Math.round(percentage * 100).toString()
    return (
        <div
            className={'rounded-lg px-4 py-2 relative font-medium w-64'}
            style={{ background: backgroundColor, marginBottom: isLast ? '0' : '0.5rem' }}
        >
            <div
                className={'w-[70%] h-full z-10 absolute top-0 left-0 rounded-lg'}
                style={{ background: color, width: percentageStr + '%' }}
            ></div>
            <div className={'relative z-20'}>
                <p>
                    <span className={'text-8xl'}>{percentageStr}</span>
                    <span className={'absolute top-2 text-5xl'}>%</span>
                    <span className={'absolute bottom-2 right-4 text-right text-2xl font-normal'}>
                        {label}
                    </span>
                </p>
            </div>
        </div>
    )
}
export default PercentageVotesBlock
