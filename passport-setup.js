const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('./config.json');
const db = require('./database');
const logger = require('./logger');
logger.module = 'passport';

passport.serializeUser((user, done) => {
    if(user){
        // error, userID
        done(null, user.userID);
    } else {
        done(null, false);
    }
});

passport.deserializeUser((id, done) => {
    if(id){
        // error, userID
        db.queryUserByID(id).then((result) => {
            done(null, result[0]);
        });
    } else {
        done(null, false);
    }
});

passport.use(
    new GoogleStrategy({
        // options for strategy
        callbackURL: '/auth/google/redirect',
        clientID: config.keys.google.clientID,
        clientSecret: config.keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        db.queryUserByEmail(profile.emails[0].value).then((result) => {
            const valid = !(result.length === 0);
            if(valid){
                logger.log(profile.emails[0].value + " has successfully logged in");
                // error, user
                db.updateUser(profile.emails[0].value, profile.id, profile.photos[0].value).then((upd) => {
                    done(null, result[0]);
                })
            } else {
                logger.log(profile.emails[0].value + " is not a valid user");
                done(null, false);
            }
        })
    })
);