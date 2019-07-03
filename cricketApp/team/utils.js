const db = require('../database');
const R = require('ramda');

module.exports.getTeam = async (playerId) => {
    return R.head(await db.sequelize.query("SELECT * FROM `teams` WHERE id in (SELECT teamId FROM `players` WHERE playerId=" + playerId + ")", { type: db.sequelize.QueryTypes.SELECT }));
}