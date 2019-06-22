const Router = require('express').Router;
const { isLoggedIn, isLoggedInApi } = require('../users/middleware');
const db = require('../database/index');
console.log(db);
const router = Router();
router.get('/', isLoggedIn, (req, res) => {
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ 'where': { 'userId': req.user.id } }),
        messages: req.flash('message')
    }
    res.render('match/index', context);
});

module.exports = router;