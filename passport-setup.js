const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('./config.json');
const db = require('./database');
const logger = require('./logger');
logger.module = 'passport';

passport.serializeUser((user, done) => {
    logger.log("In serializeUser");
    logger.log(user);
    if(user != null){
        // error, userID
        done(null, user.userID);
    } else {
        done(null, null);
    }
});

passport.deserializeUser((id, done) => {
    logger.log("In deserializeUser");
    logger.log(id);
    if(id != null){
        // error, userID
        db.queryUserByID(id).then((result) => {
            done(null, result[0]);
        });
    } else {
        done(null, null);
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
        logger.log('passport callback function fired');
        logger.log(profile);
        db.queryUserByEmail(profile.emails[0].value).then((result) => {
            logger.log(result);
            logger.log(result.length);
            // const valid = !(Object.keys(result).length === 0 && result.constructor === Object);
            const valid = !(result.length === 0);
            if(valid){
                logger.log(profile.emails[0].value + " is a valid user");
                // error, user
                db.updateUser(profile.emails[0].value, profile.id, profile.name.givenName, profile.name.familyName).then((upd) => {
                    done(null, result[0]);
                })
            } else {
                logger.log(profile.emails[0].value + " is not a valid user");
                done(null, null);
            }
        })
    })
);