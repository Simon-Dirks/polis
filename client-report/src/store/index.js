// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// import rootReducer from '../reducers'
import { ViewState } from '../models/viewState'
import { UPDATE_VIEW_STATE } from './actions/viewStateActions'

const initialState = {
    viewState: ViewState.ParticipantsGraph,
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VIEW_STATE:
            return {
                ...state,
                viewState: action.payload,
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
