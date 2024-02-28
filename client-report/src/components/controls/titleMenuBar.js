import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateViewCategory, updateViewState } from '../../store/actions'
import _ from 'lodash'
import megaphoneIcon from '../../assets/megaphone.svg'
import infoIcon from '../../assets/info.svg'

const TitleMenuBar = ({
    viewState,
    updateViewState,
    updateViewCategory,
    ptptCount,
    ptptCountTotal,
    math,
    conversation,
}) => {
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
            <div className={'p-2 flex-1 flex items-center md:pr-[22rem]'}>
                <span className={'hidden md:block ml-8 font-medium text-left'}>
                    {conversation.topic}
                </span>

                <div className={'ml-12 hidden xl:block'}>
                    <span>
                        <span className={'font-medium'}>{ptptCountTotal}</span>&nbsp;deelnemers
                    </span>
                    {/*<span className={'ml-4'}>*/}
                    {/*    <strong>{ptptCount}</strong>&nbsp;gegroepeerd*/}
                    {/*</span>*/}
                    <span className={'ml-4'}>
                        <span className={'font-medium'}>
                            {computeVoteTotal(math['user-vote-counts'])}
                        </span>
                        &nbsp;stemmen
                    </span>
                    <span className={'ml-4'}>
                        <span className={'font-medium'}>{math['n-cmts']}</span>&nbsp;stellingen
                    </span>
                </div>

                <div className={'text-center w-full md:w-auto md:text-left md:absolute md:right-8'}>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-medium w-[45%] md:w-auto mr-6'
                        }
                        onClick={() => document.getElementById('welcome_overlay_modal').showModal()}
                    >
                        <img src={infoIcon} alt={'info icon'} className={'h-4 inline'} />
                        <span>Over deze tool</span>
                    </button>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 w-[45%] md:w-auto font-medium'
                        }
                        id={'open_vote_modal_btn'}
                        onClick={() => document.getElementById('vote_overlay_modal').showModal()}
                    >
                        <img
                            src={megaphoneIcon}
                            alt={'megaphone icon'}
                            className={'h-4 inline py-[0.05rem]'}
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
