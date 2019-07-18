var flash = require('connect-flash');
var express = require('express');
var multer = require('multer');
var R = require('ramda');
var { isLoggedIn } = require('./users/middleware');
var { getUsersData } = require('./utils/user');
var path = require('path');
var { usersData } = require('./utils/user');
var passport = require('passport');
var session = require('express-session');
var env = process.env.NODE_ENV || "development";
var db = require('./database');
const socket = require('socket.io')

var sessionConfig = require(path.join(__dirname, 'config', 'config.json'))[env].session;

var app = express();

app.use(flash())
//For BodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


let getFollowSuggestions = async (id) => {
    return await db.sequelize.query("SELECT users.id as id, firstname, lastname, email, profilePic, wickets, runs, matchPlayed FROM `users` INNER JOIN `profiles` on users.id = profiles.userId  WHERE users.id not in (SELECT followingId as id FROM `follows` WHERE userId = " + id + ")",
        { type: db.sequelize.QueryTypes.SELECT }
    )
}

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
    const followSuggestions = await getFollowSuggestions(req.user.id);
    console.log(followSuggestions);
    const context = {
        user: req.user,
        profile: await db.Profile.findOne({ where: { userId: req.user.id } }),
        grounds: await db.ground.findAll(),
        messages: req.flash('message'),
        followers: followers,
        followings: followings,
        followSuggestions
    }
    res.render('dashboard', context);
});


//load passport strategies
require('./config/passport/passport.js')(passport, require('./database').User);

//Routes
app.use('/users', require('./users'));
app.use('/profile', require('./profile'));
app.use('/ground', require('./grounds/routes.js'));
app.use('/team', require('./team'));
app.use('/match', require('./match'));
app.use('/follow', require('./follow/route.js'));
app.use('/chat', require('./chat/route.js'));
app.get('/scoring',(req,res)=>{
    res.render('scoring/scoring')
})
var server = app.listen(3000, function (err) {

    if (!err)

        console.log("Site is live");

    else console.log(err)

});

var io = socket(server)

io.on('connection', function (socket) {
    console.log(socket.id + "connected")

    socket.on('disconnect', () => {
        console.log(socket.id + 'disconnected')
    })

    socket.on('chat', (data) => {
        socket.broadcast.emit('chat', data)
        db.Chat.create({ message: data.msg, userId: data.user, following_id: data.fId })
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
    socket.on('clear', (data) => {
        socket.broadcast.emit('clear', data)
    })
})