module.exports = (db, Sequelize) => {
    const Bowling = db.define('Bowling', {
        team:{
            type:Sequelize.TEXT
        },
        name:{
            type:Sequelize.TEXT
        },
        wickets:{
            type:Sequelize.INTEGER
        },
        overs:{
            type:Sequelize.INTEGER
        },
        runs:{
            type:Sequelize.INTEGER
        },
        maidens:{
            type:Sequelize.INTEGER
        },
        sixes:{
            type:Sequelize.INTEGER
        },
        fours:{
            type:Sequelize.INTEGER
        },         
        dots:{
            type:Sequelize.INTEGER
        },
    })

    Bowling.associations = (db) => {
       db.Match.hasMany(db.Bowling)
    }

    return Bowling
}