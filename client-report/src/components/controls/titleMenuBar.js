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

                <div className={'ml-12 hidden xl:block'}>
                    <span>
                        <strong>{ptptCountTotal}</strong>&nbsp;deelnemers
                    </span>
                    {/*<span className={'ml-4'}>*/}
                    {/*    <strong>{ptptCount}</strong>&nbsp;gegroepeerd*/}
                    {/*</span>*/}
                    <span className={'ml-4'}>
                        <strong>{computeVoteTotal(math['user-vote-counts'])}</strong>&nbsp;stemmen
                    </span>
                    <span className={'ml-4'}>
                        <strong>{math['n-cmts']}</strong>&nbsp;stellingen
                    </span>
                </div>

                <div className={'text-center w-full md:w-auto md:text-left md:absolute md:right-8'}>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 font-semibold w-[45%] md:w-auto mr-6 inline-block text-left'
                        }
                        onClick={() => {
                            updateWelcomeShown(true)
                        }}
                    >
                        <img src={infoIcon} alt={'info icon'} className={'h-4 inline mr-2'} />
                        <span className={'relative top-[0.1rem]'}>Over deze tool</span>
                    </button>
                    <button
                        className={
                            'btn btn-sm rounded-full bg-white border border-kennislink-light-gray px-4 py-0 w-[45%] md:w-auto font-semibold inline-block text-left'
                        }
                        href={'https://www.nemokennislink.nl/pagina/polis-hoe-werkt-het/'}
                        target={'_blank'}
                    >
                        <img
                            src={megaphoneIcon}
                            alt={'megaphone icon'}
                            className={'h-4 mr-2 inline py-[0.05rem]'}
                        />
                        <span className={'relative top-[0.1rem]'}>Stem mee</span>
                    </button>
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
