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
        status: Sequelize.INTEGER // 0: invited, 1: selecting team etc, 3: playing
    })

    Match.associations = (db) => {

    }

    return Match
}