import React from 'react'
import PercentageVotesBlock from './percentageVotesBlock'

const PercentageVotesBlocks = ({ comment }) => {
    return (
        <>
            <PercentageVotesBlock
                color={'#0097F6'}
                backgroundColor={'rgba(0,151,246,0.5)'}
                percentage={comment?.pctAgreed}
                label={'Eens'}
            />
            <PercentageVotesBlock
                color={'#FA3EA4'}
                backgroundColor={'rgba(250,62,164,0.5)'}
                percentage={comment?.pctDisagreed}
                label={'Oneens'}
            />
            <PercentageVotesBlock
                color={'#FFE63A'}
                backgroundColor={'rgba(255,230,58,0.5)'}
                percentage={comment?.pctVoted}
                label={'Overslaan'}
                isLast={true}
            />
        </>
    )
}
export default PercentageVotesBlocks
