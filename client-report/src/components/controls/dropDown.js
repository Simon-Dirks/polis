import React, { useState } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import triangleUp from '../../assets/triangle-up.svg'
import triangleDown from '../../assets/triangle-down.svg'

const DropDown = ({ buttonLabel, children }) => {
    const [isShowing, setIsShowing] = useState(false)

    return (
        <div className="dropdown">
            <div
                tabIndex={0}
                role="button"
                onFocus={() => {
                    setIsShowing(true)
                }}
                onBlur={() => {
                    setIsShowing(false)
                }}
            >
                {buttonLabel}
                <img src={isShowing ? triangleUp : triangleDown} className={'ml-2 inline-block'} />
            </div>
            <ul
                tabIndex={0}
                className="p-2 menu dropdown-content z-[1] w-52"
                onFocus={() => {
                    setIsShowing(true)
                }}
                onBlur={() => {
                    setIsShowing(false)
                }}
            >
                {children}
            </ul>
        </div>
    )
}
export default connect(mapStateToProps, {})(DropDown)
