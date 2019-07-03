var exports = module.exports = {};
var db = require('../database');

const getJoinTeamNotification = async (id) => {
    return await db.sequelize.query("SELECT teams.id as id, name, playerId FROM `players` INNER JOIN `teams` ON players.teamId = teams.id WHERE players.playerId = " + id + " and players.status = 0", { type: db.sequelize.QueryTypes.SELECT });
}

const getMatcheMackingNotification = async (id) => {
    return await db.sequelize.query("SELECT matches.id as id, name as team FROM `matches` INNER JOIN `teams` on teamA=teams.id where matches.teamB in (SELECT teams.id as teamB FROM `teams` WHERE captainId=" + id + ") and matches.status = 0", { type: db.sequelize.QueryTypes.SELECT });
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
    let matchMakingNotification = await getMatcheMackingNotification(req.user.id)
    notifications.joinTeamNotification = joinTeamNotification;
    notifications.matchMakingNotification = matchMakingNotification;
    console.log(notifications);
    res.status(200).json(notifications)
}

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}