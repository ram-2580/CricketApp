module.exports = (db, Sequelize) => {

    const Ground = db.define('ground', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        name: {
            type: Sequelize.TEXT
        },
        landmark: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        district: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        country: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        contact: {
            type: Sequelize.STRING
        },
        img_url: {
            type: Sequelize.TEXT
        },
        latitude:{
            type : Sequelize.DECIMAL(10,8)
        },
        longitude:{
            type : Sequelize.DECIMAL(11,8)
        }
    });

    Ground.associations = (db) => {

    }

    return Ground;
}