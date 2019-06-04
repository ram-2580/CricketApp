module.exports = (db, Sequelize) => {
    const Player = db.define('Player', {
       name:{
           type:Sequelize.TEXT
       },
       type:{
           type:Sequelize.TEXT
       },
    })

    Player.associations = (db) => {
       db.Team.hasMany(db.Player)
       db.User.hasOne(db.Player)
    }

    return Player
}