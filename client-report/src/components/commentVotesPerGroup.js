import _ from 'lodash'
import React from 'react'
import VotePieChart from './votePieChart'
import { brandColors, groupLabels } from './globals'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../store/actions'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'
import DataUtils from '../util/dataUtils'
import Tag from './tag'
import CommentRepresentativeGroupsText from './lists/commentRepresentativeGroupsText'
import ArrowButton, { ArrowButtonDirection, ArrowButtonTarget } from './controls/arrowButton'
import { ViewCategory, ViewState } from '../models/viewState'

const CommentVotesPerGroup = ({
    comments,
    groupVotes,
    voteColors,
    commentTid,
    math,
    updateSelectedGroupId,
    updateViewState,
    updateViewCategory,
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
        <div className={'h-full flex'}>
            {/*LEFT ARROW*/}
            <div className="flex-1 flex items-center justify-center">
                <ArrowButton
                    direction={ArrowButtonDirection.Previous}
                    target={ArrowButtonTarget.Statement}
                    comments={comments}
                ></ArrowButton>
            </div>

            {/* MIDDLE*/}
            <div className="w-3/4 mx-auto flex flex-col justify-center">
                {comment && (
                    <div className={'mb-16 w-3/4 mx-auto'}>
                        <div className={'text-xl text-kennislink-dark-gray'}>
                            Stelling {comment.tid}
                            <CommentRepresentativeGroupsText
                                groupIdsForComment={groupIdsForComment}
                            />
                        </div>
                        <p className={'text-3xl font-bold mb-3'}>{comment.txt}</p>

                        <Tag>Aantal stemmen: {comment.saw}</Tag>
                    </div>
                )}

                {/*TODO: Update pie chart size to fit dynamically*/}
                <div className={'grid grid-flow-col gap-4 overflow-x-scroll'}>
                    {comment && (
                        <div className={'flex flex-col items-center'}>
                            <VotePieChart
                                comment={comment}
                                voteCounts={{
                                    A: comment.agreed,
                                    D: comment.disagreed,
                                    S: comment.saw,
                                }}
                                nMembers={totalCommentVoteMembers}
                                voteColors={voteColors}
                                sizePx={200}
                                heading={'Stemgedrag alle deelnemers'}
                                subscript={'Aantal stemmen: ' + comment.saw}
                            />
                        </div>
                    )}

                    {comment &&
                        Object.entries(groupVotes).map(([groupId, groupVoteData]) => {
                            return (
                                <div
                                    key={groupId}
                                    className={'flex flex-col items-center cursor-pointer'}
                                    onClick={() => {
                                        updateSelectedGroupId(Number(groupId))
                                        updateViewCategory(ViewCategory.Groups)
                                        updateViewState(ViewState.GroupRepresentativeComments)
                                    }}
                                >
                                    {/*<p key={groupId}>{JSON.stringify(groupVoteData)}</p>*/}
                                    <VotePieChart
                                        comment={comment}
                                        voteCounts={groupVoteData?.votes[comment.tid]}
                                        nMembers={groupVoteData['n-members']}
                                        voteColors={brandColors.groups[groupId]}
                                        sizePx={200}
                                        heading={'Stemgedrag Groep ' + groupLabels[groupId]}
                                        subscript={
                                            'Aantal stemmen: ' + groupVoteData?.votes[comment.tid].S
                                        }
                                    />
                                </div>
                            )
                        })}
                </div>
            </div>

            {/*RIGHT ARROW*/}
            <div className="flex-1 flex items-center justify-center">
                {/*TODO: Define / add disabled state here based on number of available comments*/}
                <ArrowButton
                    direction={ArrowButtonDirection.Next}
                    target={ArrowButtonTarget.Statement}
                    comments={comments}
                ></ArrowButton>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(CommentVotesPerGroup)
