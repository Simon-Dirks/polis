import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateViewCategory, updateViewState, updateWelcomeShown } from '../../store/actions'
import _ from 'lodash'
import megaphoneIcon from '../../assets/megaphone.svg'
import infoIcon from '../../assets/info.svg'

const TitleMenuBar = ({
    viewState,
    updateViewState,
    updateViewCategory,
    updateWelcomeShown,
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
                <span className={'hidden md:block ml-8 font-bold text-left'}>
                    {conversation.topic}
                </span>

                <p className={'block md:hidden ml-8 font-bold text-center w-full'}>
                    U bent nu hier:
                </p>

                <div className={'ml-12 hidden xl:block'}>
                    <span>
                        <strong>{ptptCountTotal}</strong>&nbsp;deelnemers
                    </span>
                    <span className={'ml-4'}>
                        <strong>{ptptCount}</strong>&nbsp;gegroepeerd
                    </span>
                    <span className={'ml-4'}>
                        <strong>{computeVoteTotal(math['user-vote-counts'])}</strong>&nbsp;stemmen
                    </span>
                    <span className={'ml-4'}>
                        <strong>{math['n-cmts']}</strong>&nbsp;stellingen
                    </span>
                </div>

                <div className={'absolute right-8 hidden md:block'}>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-semibold mr-6'
                        }
                        onClick={() => {
                            updateWelcomeShown(true)
                        }}
                    >
                        <img src={infoIcon} alt={'info icon'} className={'h-4'} />
                        <span>Over deze tool</span>
                    </button>
                    <a
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-semibold'
                        }
                        href={'https://www.nemokennislink.nl/pagina/polis-hoe-werkt-het/'}
                        target={'_blank'}
                    >
                        <img
                            src={megaphoneIcon}
                            alt={'megaphone icon'}
                            className={'h-4 py-[0.05rem]'}
                        />
                        <span>Stem mee</span>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateWelcomeShown,
})(TitleMenuBar)
