const Router = require('express').Router;
const { isLoggedIn, isLoggedInApi } = require('../users/middleware');
const { getTeam } = require('../team/utils')
const db = require('../database');
const router = Router();

const getMatchesByTeamId = async (teamId) => {
    return await db.sequelize.query("SELECT matches.id as id, t1.name as teamAname, t2.name as teamBname FROM `matches` INNER JOIN `teams` as t1 on t1.id = matches.teamA INNER JOIN `teams` as t2 on t2.id = matches.teamB WHERE teamA = " + teamId + " or teamB = " + teamId + " and status != 0", { type: db.sequelize.QueryTypes.SELECT })
}

const updateTeamStatus = async (match, teamId) => {
    console.log(match);
    console.log(teamId);
    if (match.teamA == teamId) {
        await match.update({ 'statusTeamA': 1 })
        console.log('teamA');
    } else if (match.teamB == teamId) {
        console.log('teamB')
        await match.update({ 'statusTeamB': 1 })
    }
}

const intiallizeBatsman = async (userId, teamId, matchId) => {
    console.log(userId, teamId, matchId);
    return await db.Batting.create({ teamId: teamId, userId: userId, matchId: matchId, runs: 0, balls: 0, out: - 1 })
}

const intiallizeBowler = async (userId, teamId, matchId) => {
    return await db.Bowling.create({ teamId: teamId, userId: userId, matchId: matchId, wickets: 0, overs: 0, runs: 0, maidens: 0, sixes: 0, fours: 0, dots: 0 })
}
const getTeamMembersWithProfile = async (teamId) => {
    return await db.sequelize.query("SELECT players.teamId as teamId, users.id as userId, users.firstname as fname, users.lastname as lname, wickets, runs, matchPlayed, profilePic FROM `players` INNER JOIN `profiles` on profiles.userId = players.playerId INNER JOIN `users` on users.id = players.playerId where players.teamId = " + teamId, { type: db.sequelize.QueryTypes.SELECT });
}

const getMatchesByMatchId = async (id) => {
    return await db.Match.findOne({ where: { id: id } });
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

    context.matches = await getMatchesByTeamId(team.id);
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

router.post('/select/team', isLoggedInApi, async (req, res) => {
    let team = await getTeam(req.user.id);
    let selectionData = JSON.parse(req.body.data);
    let match = await getMatchesByMatchId(selectionData.matchId);
    // TODO check user is accessing only his matches
    // TODO check players are initiallize only once for a match
    for (var i = 0; i < selectionData.setectedPlayers.length; i++) {
        let userId = selectionData.setectedPlayers[i];
        await intiallizeBatsman(userId, team.id, selectionData.matchId)
        await intiallizeBowler(userId, team.id, selectionData.matchId)
    }
    await updateTeamStatus(match, team.id);
    res.sendStatus(200);
})

router.get('/select/team/:matchId', isLoggedIn, async (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
        messages: req.flash('message'),
    }

    let match = await getMatchesByMatchId(req.params.matchId);
    //TODO Add verification to check user is accessing only there matches

    let team = await getTeam(req.user.id);
    let teamMembers = await getTeamMembersWithProfile(team.id)
    console.log(teamMembers);
    context.teamMembers = teamMembers;
    context.matchId = req.params.matchId
    res.render('match/select-team', context);
});

module.exports = router;
