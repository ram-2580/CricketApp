module.exports = (db, Sequelize) => {
    const Team = db.define('Team', {
        team:{
            type:Sequelize.TEXT
        }
    })

    Team.associations = (db) => {
       
    }

    return Team
}