import React, { useState } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import triangleUp from '../../assets/triangle-up.svg'
import triangleDown from '../../assets/triangle-down.svg'

const DropDown = ({ buttonLabel, children }) => {
    const [isShowing, setIsShowing] = useState(false)

    return (
        <div className="dropdown relative">
            <div
                tabIndex={0}
                role="button"
                onClick={(e) => {
                    const shouldShow = !isShowing
                    setIsShowing(shouldShow)

                    if (shouldShow) {
                        document.activeElement = e.target
                    } else {
                        document.activeElement.blur()
                    }
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
                className="p-2 menu block dropdown-content z-[1] w-52 max-h-96 overflow-y-auto"
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
