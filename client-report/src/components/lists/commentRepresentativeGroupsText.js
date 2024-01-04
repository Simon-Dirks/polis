import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import { ViewCategory, ViewState } from '../../models/viewState'
import { groupLabels } from '../globals'

const commentRepresentativeGroupsText = ({
    groupIdsForComment,
    updateSelectedGroupId,
    updateViewCategory,
    updateViewState,
}) => {
    if (!groupIdsForComment) {
        console.error('No group IDs passed for comment')
        return null
    }

    return (
        <>
            {groupIdsForComment && groupIdsForComment.length > 0 && (
                <span className={'inline-block'}>
                    &nbsp;- Typerend voor{' '}
                    {groupIdsForComment.map((gid, idx) => (
                        <div key={gid} className={'inline'}>
                            <button
                                className={'underline'}
                                onClick={() => {
                                    updateSelectedGroupId(Number(gid))
                                    updateViewCategory(ViewCategory.Groups)
                                    updateViewState(ViewState.GroupRepresentativeComments)
                                }}
                            >
                                Groep {groupLabels[gid]}
                            </button>
                            <span>{idx === groupIdsForComment.length - 1 ? '' : ' en '}</span>
                        </div>
                    ))}
                </span>
            )}
        </>
    )
}

export default connect(mapStateToProps, {
    updateSelectedGroupId,
    updateViewCategory,
    updateViewState,
})(commentRepresentativeGroupsText)
