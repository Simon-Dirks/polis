import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId } from '../../store/actions'
import { groupLabels } from '../globals'
import DropDown from './dropDown'

const GroupSelect = ({ selectedGroupId, updateSelectedGroupId, math }) => {
    const getNumberOfGroups = () => {
        return Object.keys(math['group-votes']).length
    }

    const getGroupIds = () => {
        return [...Array(getNumberOfGroups()).keys()]
    }

    return (
        <DropDown buttonLabel={'Groep ' + groupLabels[selectedGroupId]}>
            {getGroupIds().map((gid) => {
                return (
                    <li key={gid} className={gid === selectedGroupId ? 'font-semibold' : ''}>
                        <a
                            onClick={() => {
                                console.log('Updating selected group id', gid)
                                updateSelectedGroupId(gid)
                            }}
                        >
                            Groep {groupLabels[gid]}
                        </a>
                    </li>
                )
            })}
        </DropDown>
    )
}
export default connect(mapStateToProps, {
    updateSelectedGroupId,
})(GroupSelect)
