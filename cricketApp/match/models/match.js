module.exports = (db, Sequelize) => {
    const Match = db.define('match', {
        teamA: {
            type: Sequelize.TEXT
        },
        teamB: {
            type: Sequelize.TEXT
        },
        place: {
            type: Sequelize.TEXT
        },
        overs: {
            type: Sequelize.INTEGER
        },
        toss: {
            type: Sequelize.TEXT
        },
        result: {
            type: Sequelize.TEXT
        },
        status: Sequelize.INTEGER, // 0: invited, 1: Accepted invitation, 2: playing,
        statusTeamA: Sequelize.INTEGER, // 0: still to select team, 1: selected team
        statusTeamB: Sequelize.INTEGER,
    })

    Match.associations = (db) => {
    }

    return Match
}