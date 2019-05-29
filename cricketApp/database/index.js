var Sequelize = require("sequelize");
var path = require("path");

const dbURL = (config) => `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
const dbConnect = (config) => new Sequelize(dbURL(config))

var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env].dbConfig;

const db = {};

db.sequelize = dbConnect(config);
db.Sequelize = Sequelize;

models = {
    'User': '../users/models.js',
    'Profile': '../profile/models',
    'ground' : '../grounds/model.js'
}

Object.keys(models).forEach(key => {
    db[key] = db.sequelize.import(path.join(__dirname, models[key]))
})

//define relations
db.User.hasOne(db.Profile);
db.Profile.belongsTo(db.User);


db.sequelize.sync().catch(err => {
    console.log(err);
})

module.exports = db;