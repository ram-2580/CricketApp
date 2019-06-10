const route = require('express').Router()
const db = require('../database/index.js')
route.get('/:id', (req, res) => {
    db.sequelize.query("SELECT `profilePic`,`firstname`,`lastname` FROM `users` INNER JOIN `profiles` on users.id = profiles.userId WHERE users.id =" +req.params.id,{ type: db.sequelize.QueryTypes.SELECT }).then(profile => {
        res.render('chat/client',{profile : profile});
    })
})

module.exports = route