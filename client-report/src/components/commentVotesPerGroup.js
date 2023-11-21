import _ from 'lodash'
import React from 'react'
import VotePieChart from './votePieChart'
import { brandColors, groupLabels } from './globals'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../store/actions'
import { ViewCategory, ViewState } from '../models/viewState'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import DataUtils from '../util/dataUtils'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from './controls/arrowButton'
import Tag from './tag'

const CommentVotesPerGroup = ({
    comments,
    groupVotes,
    voteColors,
    commentTid,
    updateViewState,
    updateViewCategory,
    math,
    updateSelectedGroupId,
    selectedStatementId,
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

    // if (!comment) {
    //     return null
    // }
    return (
        <div>
            {comment && (
                <div className={'mb-4 w-3/4 mx-auto'}>
                    <p className={'text-sm'}>Stelling {comment.tid}</p>
                    <p className={'text-2xl mb-2'}>{comment.txt}</p>

                    <Tag>Aantal stemmen: {comment.saw}</Tag>

                    {groupIdsForComment.length > 0 && (
                        <Tag>
                            Typerend voor Groep:{' '}
                            {groupIdsForComment.map((gid) => (
                                <button
                                    key={gid}
                                    className={'underline mr-1'}
                                    onClick={() => {
                                        updateSelectedGroupId(Number(gid))
                                        updateViewCategory(ViewCategory.Groups)
                                        updateViewState(ViewState.GroupRepresentativeComments)
                                    }}
                                >
                                    {groupLabels[gid]}{' '}
                                </button>
                            ))}
                        </Tag>
                    )}
                </div>
            )}

            <div className={'grid grid-cols-12'}>
                <div className={'col-span-1 flex items-center text-3xl'}>
                    <ArrowButton
                        direction={ArrowButtonDirection.Previous}
                        target={ArrowButtonTarget.Statement}
                        comments={comments}
                    ></ArrowButton>
                </div>
                <div className={'col-span-10'}>
                    <div className={'grid grid-flow-col gap-4 '}>
                        {/*TODO: Center horizontally*/}
                        {comment && (
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

                        {comment &&
                            Object.entries(groupVotes).map(([groupId, groupVoteData]) => {
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
                                            subscript={
                                                'Aantal stemmen: ' +
                                                groupVoteData?.votes[comment.tid].S
                                            }
                                        />
                                    </div>
                                )
                            })}
                    </div>
                </div>

                <div className={'col-span-1 flex items-center text-3xl'}>
                    {/*TODO: Define / add disabled state here based on number of available comments*/}
                    <ArrowButton
                        direction={ArrowButtonDirection.Next}
                        target={ArrowButtonTarget.Statement}
                        comments={comments}
                    ></ArrowButton>
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(CommentVotesPerGroup)
