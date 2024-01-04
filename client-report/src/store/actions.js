export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE'
export const updateViewState = (newViewState) => ({
    type: UPDATE_VIEW_STATE,
    payload: newViewState,
})

export const UPDATE_VIEW_CATEGORY = 'UPDATE_VIEW_CATEGORY'
export const updateViewCategory = (newViewCategory) => ({
    type: UPDATE_VIEW_CATEGORY,
    payload: newViewCategory,
})

export const UPDATE_SELECTED_PARTICIPANT_ID = 'UPDATE_SELECTED_PARTICIPANT_ID'
export const updateSelectedParticipantId = (newParticipantId) => ({
    type: UPDATE_SELECTED_PARTICIPANT_ID,
    payload: newParticipantId,
})

export const UPDATE_SELECTED_GROUP_ID = 'UPDATE_SELECTED_GROUP_ID'
export const updateSelectedGroupId = (newGroupId) => ({
    type: UPDATE_SELECTED_GROUP_ID,
    payload: newGroupId,
})

export const UPDATE_SELECTED_STATEMENT_ID = 'UPDATE_SELECTED_STATEMENT_ID'
export const updateSelectedStatementId = (newStatementId) => ({
    type: UPDATE_SELECTED_STATEMENT_ID,
    payload: newStatementId,
})

export const UPDATE_WELCOME_SHOWN = 'UPDATE_WELCOME_SHOWN'
export const updateWelcomeShown = (welcomeShown) => ({
    type: UPDATE_WELCOME_SHOWN,
    payload: welcomeShown,
})
