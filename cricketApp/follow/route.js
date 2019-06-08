const route = require('express').Router()
const db = require('../database/index.js')
//var { isLoggedIn } = require('./users/middleware');

route.post('/addfollowreq',(req,res)=>{
    var data = {
        followingId : req.user.id,
        UserId : req.body.f_id
    };
    db.Follow.create(data).then(folow=>{})
})
module.exports = route