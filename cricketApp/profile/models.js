module.exports = (db, Sequelize) => {
    const Profile = db.define('profile', {
        profilePic: {
            type: Sequelize.STRING,
            defaultValue: '/uploads/profile-pics/default-image.png'
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

    Profile.associations = (db) => {
        db.User.hasOne(db.Profile);
        db.Profile.belongsTo(db.User);
    }

    return Profile
}
