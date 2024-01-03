import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../store/mapStateToProps'

const Tag = ({ children }) => {
    return (
        <span
            className={'bg-kennislink-tag-bg border border-kennislink-tag-border rounded px-2 mr-2'}
        >
            {children}
        </span>
    )
}
export default connect(mapStateToProps, {})(Tag)
