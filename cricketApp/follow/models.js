module.exports = (db, Sequelize) => {
    const Follow = db.define('follow', {
    })
    Follow.associations = (db) => {
        db.User.hasOne(db.Follow);
        db.Follow.belongsTo(db.User, { as: 'following' })
    }

    return Follow
}