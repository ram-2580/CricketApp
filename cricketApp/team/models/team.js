module.exports = (db, Sequelize) => {
    const Team = db.define('team', {
        name: {
            type: Sequelize.TEXT
        }
    })

    Team.associations = (db) => {
        db.Team.belongsTo(db.User, { 'as': 'captain' })
    }

    return Team
}