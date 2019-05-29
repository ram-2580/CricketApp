var flash = require('connect-flash');
var express = require('express');
var multer = require('multer');
var app = express();
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = process.env.NODE_ENV || "development";

var sessionConfig = require(path.join(__dirname, 'config', 'config.json'))[env].session;



app.use(flash())
//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


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



app.get('/', function (req, res) {

    res.send('Welcome to Passport with Sequelize');

});


app.use('/users', require('./users'));
app.use('/profile', require('./profile'));

//load passport strategies
require('./config/passport/passport.js')(passport, require('./database').User);
app.use('/ground',require('./grounds/routes.js'))

app.listen(3000, function (err) {

    if (!err)

        console.log("Site is live");

    else console.log(err)

});