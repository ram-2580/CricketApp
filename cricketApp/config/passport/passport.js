var bCrypt = require('bcrypt-nodejs');
var db = require('../../database');

module.exports = function (passport, user) {

    var User = user;

    var LocalStrategy = require('passport-local').Strategy;


    passport.use('local-signup', new LocalStrategy(

        {

            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true

        },



        function (req, email, password, done) {

            var generateHash = function (password) {

                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

            };



            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {

                if (user) {

                    return done(null, false,
                        req.flash('message', 'You allready have account.')
                    );

                } else {

                    var userPassword = generateHash(password);

                    var data =

                    {
                        email: email,

                        password: userPassword,

                        firstname: req.body.firstname,

                        lastname: req.body.lastname

                    };

                    User.create(data).then(function (newUser, created) {

                        if (!newUser) {
                            return done("Null", false);
                        }

                        if (newUser) {
                            db.Profile.create({
                                userId: newUser.dataValues.id
                            }).then((newProfile, option) => {
                                console.log("Profile created")
                            })
                            return done(null, newUser, req.flash('message', 'Your account is created.'));
                        }

                    });

                }

            });

        }

    ));

    passport.use('local-signin', new LocalStrategy(

        {


            usernameField: 'email',

            passwordField: 'password',

            passReqToCallback: true

        },


        function (req, email, password, done) {

            var User = user;

            var isValidPassword = function (userpass, password) {

                return bCrypt.compareSync(password, userpass);

            }

            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {

                if (!user) {
                    return done(null, false,
                        req.flash('message', 'Account does not exist')
                    );

                }

                if (!isValidPassword(user.password, password)) {

                    return done(null, false,
                        req.flash('message', 'Password is wrong')
                    );

                }


                var userinfo = user.get();
                return done(null, userinfo);


            }).catch(function (err) {

                console.log("Error:", err);

                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });

            });


        }

    ));

    //serialize
    passport.serializeUser(function (user, done) {

        done(null, user.id);

    });

    // deserialize user 
    passport.deserializeUser(function (id, done) {

        User.findByPk(id).then(function (user) {

            if (user) {

                done(null, user.get());

            } else {

                done(user.errors, null);

            }

        });

    });



}


