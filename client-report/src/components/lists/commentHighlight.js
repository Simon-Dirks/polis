import VotePieChart from '../votePieChart'
import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedStatementId,
    updateViewState,
} from '../../store/actions'
import { ViewState } from '../../models/viewState'
import DataUtils from '../../util/dataUtils'
import { groupLabels } from '../globals'
import Tag from '../tag'

const CommentHighlight = ({
    comment,
    math,
    voteColors,
    updateSelectedStatementId,
    updateSelectedGroupId,
    updateViewState,
}) => {
    if (!comment) {
        console.error('No comment passed')
        return null
    }

    const groupIdsForComment = DataUtils.getGroupIdsForComment(comment.tid, math)

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
                    <div className={'text-xl'}>
                        <button
                            className={'underline inline-block'}
                            onClick={() => {
                                updateSelectedStatementId(comment.tid)
                                updateViewState(ViewState.Statement)
                            }}
                        >
                            Stelling {comment.tid}{' '}
                        </button>

                        {/*TODO: Refactor into component?*/}
                        {groupIdsForComment && groupIdsForComment.length > 0 && (
                            <span className={'inline-block'}>
                                &nbsp;- Typerend voor{' '}
                                {groupIdsForComment.map((gid, idx) => (
                                    <>
                                        <button
                                            key={gid}
                                            className={'underline'}
                                            onClick={() => {
                                                updateSelectedGroupId(Number(gid))
                                                updateViewState(
                                                    ViewState.GroupRepresentativeComments
                                                )
                                            }}
                                        >
                                            Groep {groupLabels[gid]}
                                        </button>
                                        <span>
                                            {idx === groupIdsForComment.length - 1 ? '' : ' en '}
                                        </span>
                                    </>
                                ))}
                            </span>
                        )}
                    </div>

                    <p className={'text-3xl font-bold mt-1 leading-9 mb-3'}>{comment.txt}</p>

                    <Tag>Aantal stemmen: XXX</Tag>

                    {/*<button*/}
                    {/*    className={'underline mt-2'}*/}
                    {/*    onClick={() => {*/}
                    {/*        updateViewState(ViewState.AllStatementVotes)*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    Bekijk alle stellingen &gt;*/}
                    {/*</button>*/}
                </div>
            </div>
        </>
    )
}

export default connect(mapStateToProps, {
    updateViewState,
    updateSelectedStatementId,
    updateSelectedGroupId,
})(CommentHighlight)
