var flash = require('connect-flash');
var express = require('express');
var multer = require('multer');
var R = require('ramda');
var { isLoggedIn } = require('./users/middleware');
var { getUsersData } = require('./utils/user');
var app = express();
var path = require('path');
var { usersData } = require('./utils/user');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = process.env.NODE_ENV || "development";
var db = require('./database');

var sessionConfig = require(path.join(__dirname, 'config', 'config.json'))[env].session;



app.use(flash())
//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: sessionConfig.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("./public"));

app.set('views', './views')

app.set('view engine', '.ejs');



app.get('/', isLoggedIn, async function (req, res) {


    const following = await db.Follow.findAll({
        where: { userId: req.user.id },
        attributes: ['followingId'],
    });

    const follower = await db.Follow.findAll({
        where: { followingId: req.user.id },
        attributes: ['userId']
    });

    const followerIds = follower.map(f => f.userId);
    const followingIds = following.map(f => f.followingId)

    const followers = await getUsersData(followerIds);
    const followings = await getUsersData(followingIds);


    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ where: { userId: req.user.id } }),
        messages: req.flash('message'),
        followers: followers,
        followings: followings
    }
    res.render('dashboard', context);
});


//load passport strategies
require('./config/passport/passport.js')(passport, require('./database').User);

//Routes
app.use('/users', require('./users'));
app.use('/profile', require('./profile'));
app.use('/ground', require('./grounds/routes.js'))


app.listen(3000, function (err) {

    if (!err)

        console.log("Site is live");

    else console.log(err)

});