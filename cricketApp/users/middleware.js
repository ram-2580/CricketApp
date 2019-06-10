function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

        return next();

    res.redirect('/users/signin');

}

module.exports.isLoggedInApi = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.status(401).send();
}

module.exports.isLoggedIn = isLoggedIn;