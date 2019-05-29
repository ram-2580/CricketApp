function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

        return next();

    res.redirect('/users/signin');

}

module.exports.isLoggedIn = isLoggedIn;