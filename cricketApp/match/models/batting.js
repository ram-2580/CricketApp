module.exports = (db, Sequelize) => {
    const Batting = db.define('Batting', {
        runs: {
            type: Sequelize.INTEGER
        },
        balls: {
            type: Sequelize.INTEGER
        },
        out: {
            type: Sequelize.TEXT
        },
    })

    Batting.associations = (db) => {
        db.Match.hasMany(db.Batting)
        db.User.hasMany(db.Batting)
        db.Team.hasMany(db.Batting)
    }

    return Batting
}
