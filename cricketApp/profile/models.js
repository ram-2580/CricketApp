module.exports = (db, Sequelize) => {
    return db.define('profile', {
        profilePic: {
            type: Sequelize.STRING,
            defaultValue: 'default-pic.jpg'
        },
        runScored: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        matchPlayed: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });
}
