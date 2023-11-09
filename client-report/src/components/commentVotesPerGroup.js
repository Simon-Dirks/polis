import _ from 'lodash'
import React from 'react'
import VotePieChart from './votePieChart'
import { brandColors, groupLabels } from './globals'
import { updateSelectedGroupId, updateViewState } from '../store/actions'
import { ViewState } from '../models/viewState'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import DataUtils from '../util/dataUtils'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from './controls/arrowButton'

const CommentVotesPerGroup = ({
    comments,
    groupVotes,
    voteColors,
    commentTid,
    updateViewState,
    math,
    updateSelectedGroupId,
    selectedStatementId,
    highlightGroupIds,
}) => {
    if (!comments) {
        console.error('No comments passed')
        return null
    }

    let totalCommentVoteMembers = 0
    _.forEach(groupVotes, (g) => {
        let nMembers = g['n-members']
        totalCommentVoteMembers += nMembers
    })

    const commentsByTid = _.keyBy(comments, 'tid')
    const comment = commentsByTid[commentTid]

    const groupIdsForComment = DataUtils.getGroupIdsForComment(commentTid, math)

    const highlightGroupIdsAreSpecified = highlightGroupIds && highlightGroupIds.length >= 0
    const shouldHighlightAllVotes = highlightGroupIdsAreSpecified && highlightGroupIds.includes(-1)
    // if (!comment) {
    //     return null
    // }
    return (
        <div>
            {comment && (
                <div className={'mb-4 w-3/4 mx-auto'}>
                    <p className={'text-sm mt-2'}>
                        Stelling {comment.tid}
                        {groupIdsForComment.length > 0 && (
                            <span>
                                {' '}
                                is typerend voor Groep:{' '}
                                {groupIdsForComment.map((gid) => (
                                    <button
                                        key={gid}
                                        className={'underline mr-1'}
                                        onClick={() => {
                                            updateSelectedGroupId(Number(gid))
                                            updateViewState(ViewState.GroupRepresentativeComments)
                                        }}
                                    >
                                        {groupLabels[gid]}{' '}
                                    </button>
                                ))}
                            </span>
                        )}
                    </p>
                    <p className={'text-2xl'}>{comment.txt}</p>
                    <button
                        className={'underline'}
                        onClick={() => {
                            updateViewState(ViewState.AllStatements)
                        }}
                    >
                        Bekijk alle stellingen &gt;
                    </button>
                </div>
            )}

            <div className={'grid grid-cols-12'}>
                <div className={'col-span-1 flex items-center text-3xl'}>
                    <ArrowButton
                        disabled={selectedStatementId <= 0}
                        direction={ArrowButtonDirection.Previous}
                        target={ArrowButtonTarget.Statement}
                    ></ArrowButton>
                </div>
                <div className={'col-span-10'}>
                    <div className={'grid grid-flow-col gap-4 '}>
                        {/*TODO: Center horizontally*/}
                        {(!highlightGroupIdsAreSpecified || shouldHighlightAllVotes) && comment && (
                            <div
                                onClick={() => {
                                    updateSelectedGroupId(Number(-1))
                                    updateViewState(ViewState.StatementSpecificGroup)
                                }}
                            >
                                <VotePieChart
                                    comment={comment}
                                    voteCounts={{
                                        A: comment.agreed,
                                        D: comment.disagreed,
                                        S: comment.saw,
                                    }}
                                    nMembers={totalCommentVoteMembers}
                                    voteColors={voteColors}
                                    sizePx={shouldHighlightAllVotes ? 400 : 150}
                                    heading={'Stemgedrag alle deelnemers'}
                                    subscript={'Aantal stemmen: ' + comment.saw}
                                    styleHeadingAsClickable={!highlightGroupIdsAreSpecified}
                                />
                            </div>
                        )}

                        {comment &&
                            Object.entries(groupVotes).map(([groupId, groupVoteData]) => {
                                const groupIdNum = Number(groupId)
                                const shouldRenderGroup =
                                    !highlightGroupIdsAreSpecified ||
                                    highlightGroupIds.includes(groupIdNum)
                                if (!shouldRenderGroup) {
                                    return null
                                }

                                return (
                                    <div
                                        key={groupId}
                                        onClick={() => {
                                            updateSelectedGroupId(Number(groupId))
                                            updateViewState(ViewState.StatementSpecificGroup)
                                        }}
                                    >
                                        {/*<p key={groupId}>{JSON.stringify(groupVoteData)}</p>*/}
                                        <VotePieChart
                                            comment={comment}
                                            voteCounts={groupVoteData?.votes[comment.tid]}
                                            nMembers={groupVoteData['n-members']}
                                            voteColors={brandColors.groups[groupId]}
                                            sizePx={highlightGroupIdsAreSpecified ? 400 : 150}
                                            heading={'Stemgedrag Groep ' + groupLabels[groupId]}
                                            subscript={
                                                'Aantal stemmen: ' +
                                                groupVoteData?.votes[comment.tid].S
                                            }
                                            styleHeadingAsClickable={!highlightGroupIdsAreSpecified}
                                        />
                                    </div>
                                )
                            })}
                    </div>
                </div>

                <div className={'col-span-1 flex items-center text-3xl'}>
                    {/*TODO: Define / add disabled state here based on number of available comments*/}
                    <ArrowButton
                        disabled={false}
                        direction={ArrowButtonDirection.Next}
                        target={ArrowButtonTarget.Statement}
                    ></ArrowButton>
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, { updateViewState, updateSelectedGroupId })(
    CommentVotesPerGroup
)
