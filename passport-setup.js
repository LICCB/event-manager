const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('./config.json');
const db = require('./database');

passport.serializeUser((user, done) => {
    console.log("In serializeUser");
    console.log(user);
    if(user != null){
        // error, userID
        done(null, user.userID);
    } else {
        done(null, null);
    }
});

passport.deserializeUser((id, done) => {
    console.log("In deserializeUser");
    console.log(id);
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
        console.log('passport callback function fired');
        console.log(profile);
        db.queryUserByEmail(profile.emails[0].value).then((result) => {
            console.log(result);
            const valid = !(Object.keys(result).length === 0 && result.constructor === Object);
            if(valid){
                console.log(profile.emails[0].value + " is a valid user");
                // error, user
                db.updateUser(profile.emails[0].value, profile.id, profile.name.givenName, profile.name.familyName).then((upd) => {
                    done(null, result[0]);
                })
            } else {
                console.log(profile.emails[0].value + " is not a valid user");
                done(null, null);
            }
        })
    })
);