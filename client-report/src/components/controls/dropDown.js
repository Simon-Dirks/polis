import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import triangleUp from '../../assets/triangle-up.svg'
import triangleDown from '../../assets/triangle-down.svg'

const DropDown = ({ buttonLabel, children }) => {
    const [isShowing, setIsShowing] = useState(false)
    const buttonRef = useRef(null)

    return (
        <div className="dropdown relative">
            <div
                ref={buttonRef}
                tabIndex={0}
                role="button"
                onClick={(e) => {
                    const shouldShow = !isShowing
                    setIsShowing(shouldShow)

                    if (shouldShow) {
                        e.target.focus()
                    } else {
                        document.activeElement.blur()
                    }
                }}
                onBlur={() => {
                    setIsShowing(false)
                }}
                className={'select-none'}
            >
                {buttonLabel}
                <img src={isShowing ? triangleUp : triangleDown} className={'ml-2 inline-block'} />
            </div>
            <ul
                tabIndex={0}
                className="p-2 menu block dropdown-content z-[1] w-52 max-h-96 overflow-y-auto"
                onFocus={() => {
                    setTimeout(() => {
                        setIsShowing(true)
                    })
                }}
                onBlur={() => {
                    setTimeout(() => {
                        const hasFocusedOnButton = document.activeElement === buttonRef.current
                        if (!hasFocusedOnButton) {
                            setIsShowing(false)
                        }
                    })
                }}
            >
                {children}
            </ul>
        </div>
    )
}
export default connect(mapStateToProps, {})(DropDown)
