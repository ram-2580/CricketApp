var route = require('express').Router();
var { isLoggedIn } = require('../users/middleware');
var db = require('../database/index.js');

route.get('/add', isLoggedIn, async (req, res) => {
    let context = {
        'user': req.user,
        'profile': await db.Profile.findOne({ where: { userId: user.id } })
    }
    res.render('grounds/add', context)
})
route.post('/add', isLoggedIn, async (req, res) => {
    let context = {
        'user': req.user,
        'profile': await db.Profile.findOne({ where: { userId: user.id } })
    }
    console.log(req.body)
    var data = {
        name: req.body.name,
        landmark: req.body.landmark,
        city: req.body.city,
        district: req.body.district,
        state: req.body.state,
        country: req.body.state,
        email: req.body.email,
        contact: req.body.contactnumber,
        img_url: req.body.imageurl
    }
    db.ground.create(data).then(ground => {
        context['ground'] = ground
        res.render('grounds/ground', context)
    });
})



module.exports = route