import VotePieChart from '../votePieChart'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedStatementId, updateViewCategory, updateViewState } from '../../store/actions'
import { ViewCategory, ViewState } from '../../models/viewState'

const CommentRow = ({
    comment,
    groups,
    voteColors,
    updateSelectedStatementId,
    updateViewState,
    updateViewCategory,
    isRounded,
}) => {
    if (!comment) {
        console.error('No comment passed')
        return null
    }

    return (
        <>
            <div className={'flex flex-row py-4'}>
                <button
                    className={'flex items-center pr-4'}
                    onClick={() => {
                        updateSelectedStatementId(comment.tid)
                        updateViewCategory(ViewCategory.IndivididualStatements)
                        updateViewState(ViewState.Statement)
                    }}
                >
                    <VotePieChart
                        comment={comment}
                        voteCounts={{
                            A: comment.agreed,
                            D: comment.disagreed,
                            S: comment.saw,
                        }}
                        voteColors={voteColors}
                        sizePx={50}
                        showLabels={false}
                        isRounded={isRounded}
                    />
                </button>
                <div>
                    <button
                        className={'text-sm text-kennislink-dark-gray'}
                        onClick={() => {
                            updateSelectedStatementId(comment.tid)
                            updateViewCategory(ViewCategory.IndivididualStatements)
                            updateViewState(ViewState.Statement)
                        }}
                    >
                        Stelling {comment.tid}
                    </button>
                    <p className={'text-lg'}>{comment.txt}</p>
                </div>
            </div>
            <div className={'h-1 border-b-2'}></div>
        </>
    )
}

export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedStatementId,
    updateViewCategory,
})(CommentRow)
