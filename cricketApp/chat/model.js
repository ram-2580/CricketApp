module.exports = (db, Sequelize) => {
    const Chat = db.define('chat', {
        message : {
            type : Sequelize.TEXT
        },
        following_id : {
            type : Sequelize.INTEGER
        }
    })
    Chat.associations = (db) => {
        db.User.hasMany(db.Chat);
        db.Chat.belongsTo(db.User)
    }

    return Chat
}