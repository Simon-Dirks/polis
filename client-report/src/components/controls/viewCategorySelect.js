import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import { ViewCategory, ViewStatesForCategory } from '../../models/viewState'

const ViewCategorySelect = ({ viewCategory, updateViewCategory, updateViewState }) => {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button">
                {viewCategory}
            </div>
            <ul tabIndex={0} className="p-2 menu dropdown-content z-[1] w-52">
                {Object.keys(ViewStatesForCategory).map((category) => {
                    return (
                        <li
                            key={category}
                            className={category === viewCategory ? 'font-semibold' : ''}
                        >
                            <a
                                onClick={() => {
                                    if (!category) {
                                        return
                                    }

                                    if (category === ViewCategory.AllStatements) {
                                        updateSelectedGroupId(-1)
                                    } else {
                                        updateSelectedGroupId(0)
                                    }

                                    console.log('Updating view category', category)
                                    updateViewCategory(category)
                                    updateViewState(ViewStatesForCategory[category][0])
                                }}
                            >
                                {category}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
})(ViewCategorySelect)
