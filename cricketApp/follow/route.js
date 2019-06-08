const route = require('express').Router()
const db = require('../database/index.js')
//var { isLoggedIn } = require('./users/middleware');

route.post('/addfollowreq', (req, res) => {
    var data = {
        followingId: req.body.f_id,
        userId: req.user.id
    };
    db.Follow.create(data).then(o => {
        res.send(200);
    }
    ).catch(er => {
        res.send(400);
    })
})
module.exports = route