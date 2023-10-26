export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE'

export const updateViewState = (newViewState) => ({
    type: UPDATE_VIEW_STATE,
    payload: newViewState,
})
