module.exports = (db, Sequelize) => {
    const Teamscore = db.define('Teamscore', {
        team:{
            type:Sequelize.TEXT
        },
        runs:{
            type:Sequelize.INTEGER
        },
        wickets:{
            type:Sequelize.INTEGER
        },
        overs:{
            type:Sequelize.INTEGER
        },
        inning:{
            type:Sequelize.TEXT
        },
    })

    Teamscore.associations = (db) => {
       db.Match.hasMany(db.Teamscore)
    }

    return Teamscore
}