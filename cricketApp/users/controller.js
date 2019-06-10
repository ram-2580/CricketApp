var exports = module.exports = {};
var db = require('../database');

const getJoinTeamNotification = async (id) => {
    return await db.sequelize.query("SELECT teams.id as id, name, playerId FROM `players` INNER JOIN `teams` ON players.teamId = teams.id WHERE players.playerId = " + id + " and players.status = 0", { type: db.sequelize.QueryTypes.SELECT });
}

exports.signup = function (req, res) {

    res.render('users/signup', { messages: req.flash('message') });

}

exports.signin = function (req, res) {
    res.render('users/signin', { messages: req.flash('message') });
}

exports.dashboard = function (req, res) {
    res.render('users/dashboard');
}

exports.sendNotifications = async (req, res) => {
    let notifications = {}
    let joinTeamNotification = await getJoinTeamNotification(req.user.id);
    joinTeamNotification: notifications.joinTeamNotification = joinTeamNotification;
    res.status(200).json(notifications)
}

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}