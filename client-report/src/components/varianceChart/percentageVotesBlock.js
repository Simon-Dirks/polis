import React from 'react'

const PercentageVotesBlock = ({ percentage, label, color, backgroundColor, isLast }) => {
    const percentageStr = percentage === undefined ? '...' : Math.round(percentage * 100).toString()
    return (
        <div
            className={`rounded-lg px-4 py-0.5 md:py-2 relative font-medium w-1/2 md:w-72 mb-0.5 md:mb-2 ${
                isLast ? '!mb-0' : ''
            }`}
            style={{
                background: backgroundColor,
                minWidth: '10rem',
            }}
        >
            <div
                className={'h-full z-10 absolute top-0 left-0 rounded-lg'}
                style={{ background: color, width: percentageStr + '%', transition: 'width 0.75s' }}
            ></div>
            <div className={'relative z-20'}>
                <p>
                    <span className={'text-4xl md:text-8xl'}>{percentageStr}</span>
                    <span className={'absolute top-0 md:top-2 text-xl md:text-5xl'}>%</span>
                    <span
                        className={
                            'absolute bottom-0 right-0 text-right text-lg md:text-2xl font-normal'
                        }
                    >
                        {label}
                    </span>
                </p>
            </div>
        </div>
    )
}
export default PercentageVotesBlock
