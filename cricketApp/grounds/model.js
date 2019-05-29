module.exports = (db,Sequelize) => {

return db.define('ground', {

    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },

    name: {
        type: Sequelize.TEXT
    },
    landmark:{
        type: Sequelize.STRING
    },
    city:{
        type: Sequelize.STRING
    },
    district :{
        type: Sequelize.STRING
    },
    state:{
        type: Sequelize.STRING
    },
    country:{
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
    img_url:{
        type: Sequelize.TEXT
    }
    
});
}