export const ViewState = {
    AllStatements: 'allStatements',
    StatementsGraph: 'Stellingen',
    ParticipantsGraph: 'Deelnemers',
    Statement: 'statement',
    StatementSpecificGroup: 'statementSpecificGroup',
    Participant: 'participant',
    GroupRepresentativeComments: 'group',
    AllGroupVotes: 'allGroupVotes',
}

export const ViewCategory = {
    Home: '1. Startscherm',
    Groups: '2. Groepen',
    AllStatements: '3. Alle stellingen',
    IndivididualStatements: '4. Individuele Stellingen',
}

export const ViewStatesForCategory = {
    [ViewCategory.Home]: [ViewState.ParticipantsGraph, ViewState.StatementsGraph],
    [ViewCategory.Groups]: [ViewState.GroupRepresentativeComments],
    [ViewCategory.AllStatements]: [ViewState.AllStatements],
    [ViewCategory.IndivididualStatements]: [ViewState.Statement],
}
