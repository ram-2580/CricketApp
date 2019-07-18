var Sequelize = require("sequelize");
var path = require("path");

const dbURL = (config) => `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
const dbConnect = (config, options) => new Sequelize(dbURL(config), options)

var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env].dbConfig;

const db = {};

const sequelize = dbConnect(config, {
    pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


models = {
    'User': '../users/models.js',
    'Profile': '../profile/models',
    'ground': '../grounds/model.js',
    'Follow': '../follow/models.js',
    'Match': '../match/models/match.js',
    'Batting': '../match/models/batting.js',
    'Bowling': '../match/models/bowling.js',
    'Teamscore': '../match/models/teamscore.js',
    'Team': '../team/models/team.js',
    'Player': '../team/models/player.js',
    'Chat': '../chat/model.js'
}

Object.keys(models).forEach(key => {
    db[key] = sequelize.import(path.join(__dirname, models[key]))
})

Object.keys(models).forEach(key => {
    db[key].associations(db)
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync().catch(err => {
    console.log(err);
})

module.exports = db;