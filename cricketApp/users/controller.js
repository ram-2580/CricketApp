var exports = module.exports = {}

exports.signup = function (req, res) {

    res.render('users/signup', { messages: req.flash('message') });

}

exports.signin = function (req, res) {
    res.render('users/signin', { messages: req.flash('message') });
}

exports.dashboard = function (req, res) {
    res.render('users/dashboard');
}
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}