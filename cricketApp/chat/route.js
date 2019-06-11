const route = require('express').Router()
const db = require('../database/index.js')
route.get('/:id', (req, res) => {
    db.sequelize.query("SELECT `userId` as `id`,`profilePic`,`firstname`,`lastname` FROM `users` INNER JOIN `profiles` on users.id = profiles.userId WHERE users.id =" +req.params.id,{ type: db.sequelize.QueryTypes.SELECT }).then(profile => {
        db.sequelize.query("SELECT `userId` as `id`,`profilePic`,`firstname`,`lastname` FROM `users` INNER JOIN `profiles` on users.id = profiles.userId WHERE users.id =" +req.user.id,{ type: db.sequelize.QueryTypes.SELECT }).then(user=>{
            db.sequelize.query("SELECT * FROM `chats`  WHERE (( userId = " +req.user.id +" and following_id ="+ req.params.id +") OR ( userId =" +req.params.id +" and following_id ="+ req.user.id +"))",{ type: db.sequelize.QueryTypes.SELECT }).then(chat=>{
                var data = {
                    user : user[0],
                    profile : profile[0],
                    chat : chat
                }
                res.render('chat/client',{data : data})
            })
        })
    })
})
module.exports = route