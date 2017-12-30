var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'local.username' : username }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMsg', 'This username is already taken'));
                }

                var newUser = new User();
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, newUser);
                });
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'local.username' : username }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMsg', 'Username or password is incorrect'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMsg', 'Username or password is incorrect'));
                }
                return done(null, user);
            });
        });
    }));
};

