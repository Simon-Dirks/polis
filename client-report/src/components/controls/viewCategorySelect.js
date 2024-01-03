import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import { ViewCategory, ViewStatesForCategory } from '../../models/viewState'
import DropDown from './dropDown'

const ViewCategorySelect = ({
    viewCategory,
    updateViewCategory,
    updateViewState,
    updateSelectedGroupId,
}) => {
    return (
        <DropDown buttonLabel={viewCategory}>
            {Object.keys(ViewStatesForCategory).map((category) => {
                return (
                    <li key={category} className={category === viewCategory ? 'font-semibold' : ''}>
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
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(ViewCategorySelect)
