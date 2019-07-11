const Router = require('express').Router;
const { isLoggedIn, isLoggedInApi } = require('../users/middleware');
const { getTeam } = require('../team/utils')
const db = require('../database');
const router = Router();

const getMatches = async (teamId) => {
    return await db.sequelize.query("SELECT matches.id as id, t1.name as teamAname, t2.name as teamBname FROM `matches` INNER JOIN `teams` as t1 on t1.id = matches.teamA INNER JOIN `teams` as t2 on t2.id = matches.teamB WHERE teamA = " + teamId + " or teamB = " + teamId + " and status != 0", { type: db.sequelize.QueryTypes.SELECT })
}

router.get('/', isLoggedIn, async (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
        messages: req.flash('message'),
    }

    const team = await getTeam(req.user.id);
    console.log(team);
    context.isCaptain = false;

    if (req.user.id == team.captainId) {
        context.isCaptain = true;
    }

    context.matches = await getMatches(team.id);
    console.log(context.matches);
    res.render('match/index', context);
});

router.get('/accept/:matchId', isLoggedIn, async (req, res) => {
    let teamB = await db.Team.findOne({ 'where': { 'captainId': req.user.id } });

    if (!teamB) {
        res.send(400)
        return
    }
    let match = await db.Match.findOne({ 'where': { 'id': req.params.matchId, 'teamB': teamB.id } });
    match.update({ status: 1 });
    res.send(200);
});

router.get('/reject/:matchId', isLoggedIn, async (req, res) => {
    let teamB = await db.Team.findOne({ 'where': { 'captainId': req.user.id } });

    if (!teamB) {
        res.send(400)
        return
    }
    let match = await db.Match.findOne({ 'where': { 'id': req.params.matchId, 'teamB': teamB.id } });
    match.destroy().then(() => {
        res.send(200);
    });
});


module.exports = router;