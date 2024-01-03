import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateViewCategory, updateViewState } from '../../store/actions'
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
            className={
                'h-12 bg-kennislink-menu-bg flex w-full border-b border-kennislink-light-gray fixed z-50'
            }
        >
            <div className={'p-2 flex-1 flex items-center'}>
                <span className={'ml-8 font-bold'}>{conversation.topic}</span>
                <div className={'ml-12'}>
                    <span>
                        <strong>{ptptCount}</strong> deelnemers
                    </span>
                    <span className={'ml-4'}>
                        <strong>{computeVoteTotal(math['user-vote-counts'])}</strong> stemmen
                    </span>
                    <span className={'ml-4'}>
                        <strong>{math['n-cmts']}</strong> stellingen
                    </span>
                </div>

                <div className={'absolute right-8'}>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-semibold mr-6'
                        }
                    >
                        <img src={infoIcon} alt={'info icon'} className={'h-4'} />
                        <span>Over deze tool</span>
                    </button>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-semibold'
                        }
                    >
                        <img
                            src={megaphoneIcon}
                            alt={'megaphone icon'}
                            className={'h-4 py-[0.05rem]'}
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
