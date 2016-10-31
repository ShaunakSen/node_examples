var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user');
var config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.facebook = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    // Look for the user in our local db
    User.findOne({OauthId: profile.id}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!err && user != null) {
            // user exists in our local db
            done(null, user);
        }
        else {
            // Create the user
            user = new User({
                username: profile.displayName
            });
            user.OauthId = profile.id;
            user.OauthToken = accessToken;
            user.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Saving user...");
                    done(null, user);
                }
            })
        }
    });

}));