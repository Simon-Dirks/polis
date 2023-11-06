import _ from 'lodash'
import VotePieChart from '../votePieChart'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedStatementId, updateViewState } from '../../store/actions'
import { ViewState } from '../../models/viewState'

const CommentRow = ({ comment, voteColors, updateSelectedStatementId, updateViewState }) => {
    if (!comment) {
        console.error('No comment passed')
        return null
    }

    return (
        <>
            <div className={'flex flex-row py-4'}>
                <div className={'flex items-center pr-8'}>
                    <VotePieChart
                        comment={comment}
                        voteCounts={{
                            A: comment.agreed,
                            D: comment.disagreed,
                            S: comment.saw,
                        }}
                        voteColors={voteColors}
                        sizePx={75}
                        showLabels={false}
                    />
                </div>
                <div>
                    <div className={'text-lg'}>
                        <button
                            className={'underline inline-block'}
                            onClick={() => {
                                updateSelectedStatementId(comment.tid)
                                updateViewState(ViewState.Statement)
                            }}
                        >
                            Stelling {comment.tid}
                        </button>
                        <span className={'inline-block'}>&nbsp;is typerend voor&nbsp;</span>
                        {/*  TODO: Add statement group*/}
                        <button className={'underline inline-block'}>Groep XXX</button>
                    </div>

                    <p className={'text-2xl font-bold mt-1'}>{comment.txt}</p>
                    <button
                        className={'underline mt-2'}
                        onClick={() => {
                            updateViewState(ViewState.AllStatements)
                        }}
                    >
                        Bekijk alle stellingen &gt;
                    </button>
                </div>
            </div>
        </>
    )
}

export default connect(mapStateToProps, { updateViewState, updateSelectedStatementId })(CommentRow)
