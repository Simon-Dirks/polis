import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import { groupColor, groupLabels } from '../globals'
import { ViewState } from '../../models/viewState'

const GroupColorLegend = ({
    math,
    viewCategory,
    updateViewCategory,
    updateViewState,
    updateSelectedGroupId,
}) => {
    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    const getGroupIds = () => {
        return [...Array(getNumberOfGroups()).keys()]
    }

    return (
        <div
            className={
                'border border-t-0 border-kennislink-light-gray p-6 bg-white fixed top-24 right-0 z-50'
            }
        >
            <p className={'font-bold mb-2'}>Kleuren</p>
            {getGroupIds().map((groupId) => {
                return (
                    <p className={'mb-2'}>
                        <svg
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className={'h-6 inline-block mr-3'}
                            fill={groupColor(groupId)}
                        >
                            <circle cx="10" cy="10" r="10" />
                        </svg>
                        <button
                            className={'underline'}
                            onClick={() => {
                                updateViewState(ViewState.GroupRepresentativeComments)
                                updateSelectedGroupId(groupId)
                            }}
                        >
                            Groep {groupLabels[groupId]}
                        </button>
                    </p>
                )
            })}

            <p className={'mb-2'}>
                <svg
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className={'h-6 inline-block mr-3 fill-[#A8A8A8]'}
                >
                    <circle cx="10" cy="10" r="10" />
                </svg>
                <button>Geen</button>
            </p>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(GroupColorLegend)
