const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('./config.json');
const db = require('./database');

passport.serializeUser((user, done) => {
    if(user != null){
        // error, userID
        done(null, user.userID);
    } else {
        done(null, null);
    }
});

passport.deserializeUser((id, done) => {
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
        db.queryUserByEmail(profile.emails[0].value).then((result) => {
            // const valid = !(Object.keys(result).length === 0 && result.constructor === Object);
            const valid = !(result.length === 0);
            if(valid){
                // error, user
                db.updateUser(profile.emails[0].value, profile.id, profile.photos[0].value).then((upd) => {
                    done(null, result[0]);
                })
            } else {
                done(null, null);
            }
        })
    })
);