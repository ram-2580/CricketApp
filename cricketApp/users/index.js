const Router = require('express').Router;
const passport = require('passport');
const controller = require('./controller');
const { isLoggedIn, isLoggedInApi } = require('./middleware');


const router = Router()

router.get('/', (req, res) => res.send('ok'))

router.get('/signup', controller.signup);


router.get('/signin', controller.signin);


router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',

    failureRedirect: 'signup',
    failureFlash: true
}

));

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',

    failureRedirect: 'signin',
    failureFlash: true
}

));

router.get('/dashboard', isLoggedIn, controller.dashboard);

router.get('/notifications', isLoggedInApi, controller.sendNotifications);

router.get('/logout', controller.logout)

module.exports = router