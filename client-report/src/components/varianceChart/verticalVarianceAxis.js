import React from 'react'
import arrowUp from '../../assets/arrow-down.svg'
import arrowDown from '../../assets/arrow-up.svg'

const VerticalVarianceAxis = ({ height }) => {
    return (
        <div
            className={'absolute top-0 -left-12 md:hidden text-xl mt-2 w-4'}
            style={{
                height: `${height}px`,
                writingMode: 'sideways-lr',
            }}
        >
            <p className={'absolute top-0 left-0'}>
                <span>Stellingen met overeenstemming</span>
                <img src={arrowDown} alt={'Arrow icon'} className={'h-8 mb-2 inline'} />
            </p>
            <p className={'absolute bottom-0 left-0 pb-10'}>
                <img src={arrowUp} alt={'Arrow icon'} className={'h-8 inline mt-2'} />
                <span>Stellingen met verdeeldheid</span>
            </p>
        </div>
    )
}
export default VerticalVarianceAxis
