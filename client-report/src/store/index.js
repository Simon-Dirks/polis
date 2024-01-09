// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

// import rootReducer from '../reducers'
import { ViewCategory, ViewState } from '../models/viewState'
import {
    UPDATE_SELECTED_GROUP_ID,
    UPDATE_SELECTED_PARTICIPANT_ID,
    UPDATE_SELECTED_STATEMENT_ID,
    UPDATE_VIEW_CATEGORY,
    UPDATE_VIEW_STATE,
    UPDATE_WELCOME_SHOWN,
} from './actions'

const initialState = {
    viewCategory: ViewCategory.Home,
    viewState: ViewState.StatementsGraph,
    selectedParticipantId: -1,
    selectedGroupId: -1,
    selectedStatementId: 0,
    welcomeShown: true,
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VIEW_STATE:
            return {
                ...state,
                viewState: action.payload,
            }
        case UPDATE_VIEW_CATEGORY:
            return {
                ...state,
                viewCategory: action.payload,
            }
        case UPDATE_SELECTED_PARTICIPANT_ID:
            return {
                ...state,
                selectedParticipantId: action.payload,
            }
        case UPDATE_SELECTED_GROUP_ID:
            return {
                ...state,
                selectedGroupId: action.payload,
            }
        case UPDATE_SELECTED_STATEMENT_ID:
            return {
                ...state,
                selectedStatementId: action.payload,
            }
        case UPDATE_WELCOME_SHOWN:
            return {
                ...state,
                welcomeShown: action.payload,
            }
        default:
            return state
    }
}

const middleware = [thunk]

let finalCreateStore

if (process.env.NODE_ENV === 'production') {
    finalCreateStore = applyMiddleware(...middleware)(createStore)
} else {
    finalCreateStore = compose(
        applyMiddleware(...middleware),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )(createStore)
}

const configureStore = function (initialState = initialState) {
    return finalCreateStore(rootReducer, initialState)
}

export default configureStore
