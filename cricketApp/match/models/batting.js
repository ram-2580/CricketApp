module.exports = (db, Sequelize) => {
    const Batting = db.define('Batting', {
        team:{
            type:Sequelize.TEXT
        },
        name:{
            type:Sequelize.TEXT
        },
        runs:{
            type:Sequelize.INTEGER
        },
        balls:{
            type:Sequelize.INTEGER
        },
        out:{
            type:Sequelize.TEXT
        },
    })

    Batting.associations = (db) => {
       db.Match.hasMany(db.Batting)
    }

    return Batting
}
