export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE'

export const updateViewState = (newViewState) => ({
    type: UPDATE_VIEW_STATE,
    payload: newViewState,
})

export const UPDATE_SELECTED_PARTICIPANT_ID = 'UPDATE_SELECTED_PARTICIPANT_ID'

export const updateSelectedParticipantId = (newParticipantId) => ({
    type: UPDATE_SELECTED_PARTICIPANT_ID,
    payload: newParticipantId,
})
