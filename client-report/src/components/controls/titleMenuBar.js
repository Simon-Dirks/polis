import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'
import _ from 'lodash'

const TitleMenuBar = ({ viewState, updateViewState, ptptCount, math, conversation }) => {
    console.log(math)
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
            <div className={'w-8 text-center border-r-2 border-[rgba(0,0,0,0.1)]'}>i</div>
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
                <span className={'absolute right-8 underline'}>Stem mee</span>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
})(TitleMenuBar)
