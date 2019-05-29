var route = require('express').Router()
var db = require('../database/index.js')
route.get('/add',(req,res) => {
    res.render('grounds/add')
})
route.post('/add',(req,res) => {
    console.log(req.body)
    var data = {
        name : req.body.name,
        landmark : req.body.landmark,
        city : req.body.city,
        district : req.body.district,
        state : req.body.state,
        country : req.body.state,
        email : req.body.email,
        contact : req.body.contactnumber,
       img_url : req.body.imageurl
    }
    db.ground.create(data).then(ground=>{
        res.render('grounds/ground',{ground:ground})
    });
})



module.exports = route