import _ from 'lodash'
import React from 'react'
import VotePieChart from './votePieChart'
import { brandColors, groupLabels } from './globals'
import { updateSelectedGroupId, updateViewState } from '../store/actions'
import { ViewState } from '../models/viewState'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import DataUtils from '../util/dataUtils'

const CommentVotesPerGroup = ({
    comments,
    groupVotes,
    voteColors,
    commentTid,
    updateViewState,
    math,
    updateSelectedGroupId,
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
    return (
        <div>
            <div className={'mb-4'}>
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
                            <button></button>
                        </span>
                    )}
                </p>
                <p className={'text-lg'}>{comment.txt}</p>
                <button
                    className={'underline'}
                    onClick={() => {
                        updateViewState(ViewState.AllStatements)
                    }}
                >
                    Bekijk alle stellingen
                </button>
            </div>

            <div className={'grid grid-flow-col'}>
                {!highlightGroupIdsAreSpecified && (
                    <div>
                        <VotePieChart
                            comment={comment}
                            voteCounts={{
                                A: comment.agreed,
                                D: comment.disagreed,
                                S: comment.saw,
                            }}
                            nMembers={totalCommentVoteMembers}
                            voteColors={voteColors}
                            sizePx={150}
                            heading={'Stemgedrag alle deelnemers'}
                            subscript={'Aantal stemmen: ' + comment.saw}
                        />
                    </div>
                )}

                {Object.entries(groupVotes).map(([groupId, groupVoteData]) => {
                    const groupIdNum = Number(groupId)
                    const shouldRenderGroup =
                        !highlightGroupIdsAreSpecified || highlightGroupIds.includes(groupIdNum)
                    if (!shouldRenderGroup) {
                        return null
                    }

                    return (
                        <div key={groupId}>
                            {/*<p key={groupId}>{JSON.stringify(groupVoteData)}</p>*/}
                            <VotePieChart
                                comment={comment}
                                voteCounts={groupVoteData?.votes[comment.tid]}
                                nMembers={groupVoteData['n-members']}
                                voteColors={brandColors.groups[groupId]}
                                sizePx={150}
                                heading={'Stemgedrag Groep ' + groupLabels[groupId]}
                                subscript={'Aantal stemmen: ' + groupVoteData?.votes[comment.tid].S}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default connect(mapStateToProps, { updateViewState, updateSelectedGroupId })(
    CommentVotesPerGroup
)
