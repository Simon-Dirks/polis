export const ViewState = {
    StatementsGraph: 'Stellingen',
    ParticipantsGraph: 'Deelnemers',
    Statement: 'statement',
    Participant: 'participant',
    GroupRepresentativeComments: 'group',
    AllStatementVotes: 'allStatements',
    AllStatementVotesSelectedGroup: 'allGroupVotes',
}

export const ViewCategory = {
    Home: '1. Startscherm',
    Groups: '2. Groepen',
    AllStatements: '3. Alle stellingen',
    IndivididualStatements: '4. Losse stellingen',
}

export const ViewStatesForCategory = {
    [ViewCategory.Home]: [ViewState.ParticipantsGraph, ViewState.StatementsGraph],
    [ViewCategory.Groups]: [ViewState.GroupRepresentativeComments],
    [ViewCategory.AllStatements]: [ViewState.AllStatementVotes],
    [ViewCategory.IndivididualStatements]: [ViewState.Statement],
}
