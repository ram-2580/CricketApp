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

    upload(req, res, (err) => {
        if (!err) {
            console.log(req.file);
            let filePath = trimedFilePath(req);
            console.log(filePath)
            let data = req.body
            data['img_url'] = filePath + req.file.filename;
            console.log(data);
            db.ground.create(data).then(ground => {
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