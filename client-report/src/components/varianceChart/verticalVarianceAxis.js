import React from 'react'
import arrowUp from '../../assets/arrow-down.svg'
import arrowDown from '../../assets/arrow-up.svg'

const VerticalVarianceAxis = ({ height }) => {
    return (
        <div
            className={'absolute top-0 -left-12 md:hidden text-xl mt-2 w-6'}
            style={{
                height: `${height}px`,
            }}
        >
            <p className={'absolute top-0 left-0'}>
                <img src={arrowDown} alt={'Arrow icon'} className={'mb-2 inline w-6'} />
            </p>
            <p className={'absolute bottom-0 left-0 pb-10'}>
                <img src={arrowUp} alt={'Arrow icon'} className={'inline mt-2 w-6'} />
            </p>
        </div>
    )
}
export default VerticalVarianceAxis
