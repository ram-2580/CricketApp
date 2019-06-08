module.exports = (db, Sequelize) => {
    const Player = db.define('player', {
        type: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER, // 0: invited in team, 1: part of team, 2:vice-captain, 3: captain
        }
    })

    Player.associations = (db) => {
        db.Player.belongsTo(db.Team);
        db.Player.belongsTo(db.User, { 'as': 'player' });
    }

    return Player
}