const Router = require('express').Router
const { isLoggedIn } = require('../users/middleware')
const db = require('../database');
const Op = require('sequelize').Op;
const router = Router()

router.get('/', isLoggedIn, async (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
        messages: req.flash('message')
    }

    let team = await db.sequelize.query("SELECT * FROM `players` WHERE teamId in (SELECT teamId FROM `players` WHERE playerId=" +
        req.user.id + " );", { type: db.sequelize.QueryTypes.SELECT })
    if (team.length != 0) {
        console.log(team);
        context['team'] = team;
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

module.exports = router;