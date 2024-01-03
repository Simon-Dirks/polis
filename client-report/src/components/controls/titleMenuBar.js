import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'
import _ from 'lodash'
import megaphoneIcon from '../../assets/megaphone.svg'
import infoIcon from '../../assets/info.svg'

const TitleMenuBar = ({ viewState, updateViewState, ptptCount, math, conversation }) => {
    const computeVoteTotal = (users) => {
        let voteTotal = 0

        _.each(users, (count) => {
            voteTotal += count
        })

        return voteTotal
    }

    return (
        <div
            className={'h-12 bg-gray-50 flex w-full border-b-2 border-[rgba(0,0,0,0.1)] fixed z-50'}
        >
            <div className={'p-2 flex-1 flex items-center'}>
                <span className={'ml-8 font-bold'}>{conversation.topic}</span>
                <span className={'ml-4'}>
                    <strong>{ptptCount}</strong> deelnemers
                </span>
                <span className={'ml-4'}>
                    <strong>{computeVoteTotal(math['user-vote-counts'])}</strong> stemmen
                </span>
                <span className={'ml-4'}>
                    <strong>{math['n-cmts']}</strong> stellingen
                </span>
                <div className={'absolute right-8'}>
                    <button
                        className={
                            'rounded-full bg-white border-[1px] border-[#C6C6C6] px-4 font-semibold mr-6'
                        }
                    >
                        <img
                            src={infoIcon}
                            alt={'info icon'}
                            className={'inline-block mr-2 relative bottom-[0.1rem]'}
                        />
                        <span>Over deze tool</span>
                    </button>
                    <button
                        className={
                            'rounded-full bg-white border-[1px] border-[#C6C6C6] px-4 font-semibold'
                        }
                    >
                        <img
                            src={megaphoneIcon}
                            alt={'megaphone icon'}
                            className={'inline-block mr-2 relative bottom-[0.1rem]'}
                        />
                        <span>Stem mee</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
})(TitleMenuBar)
