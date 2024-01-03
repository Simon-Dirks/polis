import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateViewState } from '../../store/actions'
import { ViewStatesForCategory } from '../../models/viewState'

const ViewStateSelect = ({ viewState, viewCategory, updateViewState }) => {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button">
                {viewState}
            </div>
            <ul tabIndex={0} className="p-2 menu dropdown-content z-[1] w-52">
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
            </ul>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
})(ViewStateSelect)
