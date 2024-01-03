import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateViewState } from '../../store/actions'
import { ViewStatesForCategory } from '../../models/viewState'
import DropDown from './dropDown'

const ViewStateSelect = ({ viewState, viewCategory, updateViewState }) => {
    return (
        <DropDown buttonLabel={viewState}>
            {ViewStatesForCategory[viewCategory].map((viewStateOption) => {
                return (
                    <li
                        key={viewStateOption}
                        className={viewStateOption === viewState ? 'font-semibold' : ''}
                    >
                        <a
                            onClick={() => {
                                console.log('Updating view state', viewStateOption)
                                updateViewState(viewStateOption)
                            }}
                        >
                            {viewStateOption}
                        </a>
                    </li>
                )
            })}
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
})(ViewStateSelect)
