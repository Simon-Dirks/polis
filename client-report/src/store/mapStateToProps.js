export const mapStateToProps = (state) => ({
    viewState: state.viewState,
    viewCategory: state.viewCategory,
    selectedParticipantId: state.selectedParticipantId,
    selectedGroupId: state.selectedGroupId,
    selectedStatementId: state.selectedStatementId,
    welcomeShown: state.welcomeShown,
})
