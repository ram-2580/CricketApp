module.exports = (db, Sequelize) => {
    const Match = db.define('Match', {
        teamA:{
            type:Sequelize.TEXT
        },
        teamB:{
            type:Sequelize.TEXT
        },
        place:{
            type:Sequelize.TEXT
        },
        overs:{
            type:Sequelize.INTEGER
        },
        toss:{
            type:Sequelize.TEXT
        },
        result:{
            type:Sequelize.TEXT
        }
       
    })

    Match.associations = (db) => {
       
    }

    return Match
}