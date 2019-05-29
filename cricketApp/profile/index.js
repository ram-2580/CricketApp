const router = require('express').Router()
const controller = require('./controller');
const { isLoggedIn } = require('../users/middleware');

router.get('/', isLoggedIn, controller.profile);
router.post('/', isLoggedIn, controller.updateProfile);

module.exports = router;