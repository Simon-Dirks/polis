import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'

const Tag = ({ children }) => {
    return (
        <span className={'bg-gray-50 border-2 border-[rgba(0,0,0,0.1)] rounded px-2 mr-2'}>
            {children}
        </span>
    )
}
export default connect(mapStateToProps, {})(Tag)
