import React from 'react'
import arrowLeft from '../../assets/arrow-left.svg'
import arrowRight from '../../assets/arrow-right.svg'

const HorizontalVarianceAxis = ({ width }) => {
    return (
        <div className={'hidden md:block text-xl relative mt-2'} style={{ width: `${width}px` }}>
            <p className={'absolute top-0 left-0'}>
                <img src={arrowLeft} alt={'Arrow icon'} className={'h-8 mr-2 inline'} />
                <span>Stellingen met overeenstemming</span>
            </p>
            <p className={'absolute top-0 right-8'}>
                <span>Stellingen met verdeeldheid</span>
                <img src={arrowRight} alt={'Arrow icon'} className={'h-8 ml-2 inline'} />
            </p>
        </div>
    )
}
export default HorizontalVarianceAxis
