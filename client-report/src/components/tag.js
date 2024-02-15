import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'

const Tag = ({ children }) => {
    return (
        <span
            className={
                'border border-black rounded-full px-6 py-2 mr-2 text-sm md:text-xl whitespace-nowrap'
            }
        >
            {children}
        </span>
    )
}
export default connect(mapStateToProps, {})(Tag)
