const Router = require('express').Router
const { isLoggedIn, isLoggedInApi } = require('../users/middleware')
const db = require('../database');
const Op = require('sequelize').Op;
const router = Router()
const R = require('ramda');
const { createMatch } = require('../match/utils');


let getTeam = async (user) => {
    let members = await db.sequelize.query("SELECT users.id as id, firstname, lastname, teamId, status, email, profilePic, wickets, runs, matchPlayed  FROM `players` INNER JOIN `users` on players.playerId = users.id INNER JOIN `profiles` on players.playerId = profiles.userId WHERE players.status != 0 AND teamId in (SELECT teamId FROM `players` WHERE playerId=" +
        user.id + " );", { type: db.sequelize.QueryTypes.SELECT });
    let captain = R.head(members.filter(p => p.status == 3));
    let team = await db.Team.findOne({ 'where': { 'captainId': captain.id } });

    return team ? { id: team.id, name: team.name, members, captain } : false
}

let getPlayersToInvite = async (teamId) => {
    return await db.sequelize.query("SELECT users.id as id, firstname, lastname, email, profilePic FROM `users` INNER JOIN `profiles` on users.id = profiles.userId where users.id not in (SELECT playerId as id FROM `players` WHERE players.teamId = " + teamId + " OR players.status != 0)", { type: db.sequelize.QueryTypes.SELECT });
}

let clearOtherInvitation = async (id) => {
    return await db.Player.findAll({ 'where': { 'playerId': id, 'status': 0 } }).map(p => p.destroy());
}

let inviteUser = async (teamId, userId) => {
    return await db.Player.create({
        'teamId': teamId,
        'playerId': userId,
        'status': 0
    })
}

let joinTeam = async (teamId, userId) => {
    let p = await db.Player.findOne({ 'where': { 'teamId': teamId, 'playerId': userId } });
    if (p) {
        await p.update({ status: 1 });
        return true;
    }
    return false;
}

let rejectInvitation = async (teamId, userId) => {
    await db.Player.findAll({ 'where': { 'teamId': teamId, 'playerId': userId, 'status': 0 } }).map(p => {
        console.log(p);
        p.destroy();
    })
}

let getTeamToPlayMatch = async () => {
    const teams = await db.Team.findAll({ raw: true });
    return teams;
}

router.get('/', isLoggedIn, async (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
        messages: req.flash('message')
    }
    try {
        const team = await getTeam(req.user);
        if (team) {
            let invite = await getPlayersToInvite(team.id);
            context.team = team;
            context.invite = invite;
        }
    } catch (e) {
        console.log(e);
    }

    res.render('team/index', context);
});

router.get('/create', isLoggedIn, async (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
    }

    res.render('team/create', context);
});

router.post('/create', isLoggedIn, async (req, res) => {
    let team = await db.Team.findOne({ 'where': { 'name': req.body.name } });
    let player = await db.Player.findOne({
        'where': {
            'playerId': req.user.id,
            'status': {
                [Op.ne]: 0
            }
        },
    });

    if (player) {
        req.flash('message', 'You are part of a team');
        res.redirect('/team');
        return;
    }

    if (!team) {
        team = db.Team.build({
            'name': req.body.name,
            'captainId': req.user.id
        })
        team.save().then(team => {
            let player = db.Player.build({
                'playerId': req.user.id,
                'teamId': team.id,
                'status': 3
            })

            player.save().then(player => {
                req.flash('message', 'Your team is created');
                res.redirect('/team');
            })
        });
    } else {
        req.flash('message', 'Name is Taken');
        res.redirect('/team/create');
    }
})

router.get('/invite/:teamId/join', isLoggedInApi, async (req, res) => {
    let joined = await joinTeam(req.params.teamId, req.user.id);
    if (!joined) res.status(400).send();

    await clearOtherInvitation(req.user.id);
    res.status(200).send();
});

router.get('/invite/:teamId/reject', isLoggedInApi, async (req, res) => {
    await rejectInvitation(req.params.teamId, req.user.id);
    res.status(200).send();
})

router.get('/invite/:teamId/:id', isLoggedInApi, async (req, res) => {
    try {
        let invitation = await inviteUser(req.params.teamId, req.params.id);
        console.log(invitation);
        res.send(200);
    } catch (e) {
        res.send(400);
    }
});


//Team Invitaion backhand
router.get('/getTeamsToPlay', isLoggedInApi, async (req, res) => {
    //Todo correct the error of inviting ourselfs
    const teams = await getTeamToPlayMatch();
    res.send(teams);
});

// Creating a match request
router.get('/inviteTeam/:teamId', isLoggedInApi, async (req, res) => {
    let team = await db.Team.findOne({ 'where': { 'captainId': req.user.id } });

    if (!team) {
        return res.status(401).send('You are not captain');
    }

    if (! await createMatch(team.id, req.params.teamId)) {
        return res.status(500).send('Sorry unable to create match');
    }

    res.status(200).send();
})

module.exports = router;