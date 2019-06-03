var route = require('express').Router();
var { isLoggedIn } = require('../users/middleware');
const { fileUploader, trimedFilePath } = require('../utils/fileUpload');
var db = require('../database/index.js');
var R = require('ramda');

const upload = fileUploader('grounds-imgs', 'image')

route.get('/add', isLoggedIn, async (req, res) => {
    let context = {
        'user': req.user,
        'profile': await db.Profile.findOne({ where: { userId: req.user.id } })
    }
    res.render('grounds/add', context)
})
route.post('/add', isLoggedIn, async (req, res) => {


    let context = {
        'user': req.user,
        'profile': await db.Profile.findOne({ where: { userId: req.user.id } })
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
        latitude: req.body.lat,
        logitude: req.body.lon
    }

    upload(req, res, (err) => {
        if (!err) {
            console.log(req.file);
            let filePath = trimedFilePath(req);
            console.log(filePath)
            data['img_url'] = filePath + req.file.filename;
            console.log(data);
            db.ground.create(data).then(ground => {
                context['ground'] = ground
                req.flash('message', 'Ground is Added.')
                res.redirect('/');
            });
        }
        else {
            req.flash('message', 'Unable to upload file.');
            res.redirect('/');
        }
    })
})



module.exports = route