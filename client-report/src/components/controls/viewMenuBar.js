import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import {
    updateSelectedGroupId,
    updateSelectedParticipantId,
    updateSelectedStatementId,
    updateViewCategory,
    updateViewState,
} from '../../store/actions'
import { ViewCategory, ViewState, ViewStatesForCategory } from '../../models/viewState'
import _ from 'lodash'
import { groupLabels } from '../globals'

const ViewMenuBar = ({
    viewState,
    viewCategory,
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
    selectedGroupId,
    math,
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
                'h-12 bg-white flex w-full border-b-2 border-[rgba(0,0,0,0.1)] fixed top-12 z-50'
            }
        >
            <div className={'w-8 text-center border-r-2 border-[rgba(0,0,0,0.1)]'}>H</div>
            <div className={'flex-1 flex items-center'}>
                <span
                    className={
                        'ml-8 border-r-2 border-[rgba(0,0,0,0.1)] h-full pr-4 flex items-center'
                    }
                >
                    U bent nu hier:
                </span>
                <div
                    className={
                        'ml-4 border-r-2 border-[rgba(0,0,0,0.1)] h-full pr-4 flex items-center'
                    }
                >
                    <select
                        name="viewcategory-select"
                        id="viewcategory-select"
                        value={viewCategory}
                        onChange={(e) => {
                            const viewCategory = e.target.value
                            if (!viewCategory) {
                                return
                            }

                            console.log('Updating view category', viewCategory)
                            updateViewCategory(viewCategory)
                            updateViewState(ViewStatesForCategory[viewCategory][0])
                        }}
                    >
                        {Object.keys(ViewStatesForCategory).map((category) => {
                            return (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div
                    className={
                        'ml-4 border-r-2 border-[rgba(0,0,0,0.1)] h-full pr-4 flex items-center'
                    }
                >
                    {viewCategory === ViewCategory.Home && (
                        <select
                            name="viewstate-select"
                            id="viewstate-select"
                            value={viewState}
                            onChange={(e) => {
                                console.log('Updating view state', e.target.value)
                                updateViewState(e.target.value)
                            }}
                        >
                            {ViewStatesForCategory[viewCategory].map((viewState) => {
                                return (
                                    <option key={viewState} value={viewState}>
                                        {viewState}
                                    </option>
                                )
                            })}
                        </select>
                    )}

                    {viewCategory === ViewCategory.Groups && (
                        <div>
                            <select
                                name="group-select"
                                id="group-select"
                                value={selectedGroupId}
                                onChange={(e) => {
                                    const gid = Number(e.target.value)
                                    console.log('Updating selected group id', gid)
                                    updateSelectedGroupId(gid)
                                }}
                            >
                                {getGroupIds().map((gid) => {
                                    return (
                                        <option key={gid} value={gid}>
                                            Groep {groupLabels[gid]}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(ViewMenuBar)
