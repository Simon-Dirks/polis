import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../store/mapStateToProps'
import { updateSelectedGroupId, updateViewCategory, updateViewState } from '../../store/actions'
import { ViewCategory } from '../../models/viewState'
import ViewStateSelect from './viewStateSelect'
import GroupSelect from './groupSelect'
import StatementsGroupSelect from './statementsGroupSelect'
import StatementSelect from './statementSelect'
import ViewCategorySelect from './viewCategorySelect'

const ViewMenuBar = ({
    viewState,
    viewCategory,
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
    selectedGroupId,
    math,
    comments,
}) => {
    return (
        <div
            className={
                'h-12 bg-white flex w-full border-b border-kennislink-light-gray fixed top-12 z-50'
            }
        >
            <div className={'flex-1 flex items-center'}>
                <span
                    className={
                        'hidden md:flex ml-8 border-r border-kennislink-light-gray h-full pl-2 px-6 items-center'
                    }
                >
                    U bent nu hier:
                </span>
                <div
                    className={
                        'w-1/2 md:w-auto border-r border-kennislink-light-gray h-full flex items-center'
                    }
                >
                    <ViewCategorySelect />
                </div>
                <div
                    className={
                        'w-1/2 md:w-auto border-r border-kennislink-light-gray h-full flex items-center'
                    }
                >
                    {viewCategory === ViewCategory.Home && <ViewStateSelect></ViewStateSelect>}

                    {viewCategory === ViewCategory.Groups && (
                        <GroupSelect math={math}></GroupSelect>
                    )}

                    {viewCategory === ViewCategory.AllStatements && (
                        <StatementsGroupSelect math={math}></StatementsGroupSelect>
                    )}

                    {viewCategory === ViewCategory.IndivididualStatements && (
                        <StatementSelect math={math} comments={comments}></StatementSelect>
                    )}
                </div>
            </div>
        </div>
    )
}
export default connect(mapStateToProps, {
    updateViewState,
    updateViewCategory,
    updateSelectedGroupId,
})(ViewMenuBar)
