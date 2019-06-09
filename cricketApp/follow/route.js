const route = require('express').Router()
const db = require('../database/index.js')
//var { isLoggedIn } = require('./users/middleware');

route.post('/addFollowing', (req, res) => {
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
route.post('/removeFollowing', (req, res) => {
    var data = {
        followingId: req.body.f_id,
        userId: req.user.id
    };
    db.sequelize.query("delete from `follows` where (`followingId` =" + data.followingId+" and `userId` = "+data.userId+")",{ type: db.sequelize.QueryTypes.DELETE }).then(o => {
        res.sendStatus(200);
    }
    ).catch(er => {
        res.sendStatus(400);
    })
})
module.exports = route