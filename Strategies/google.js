'use strict';

const passport = require('passport');
const User = require('../models/user');
const googleStrategy = require('passport-google-oauth').oAuth2Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

console.log(process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, 
// (req, accessToken, refreshToken, profile, done) => {
//     User.findOne({google: profile.id}, (err, user) => {
//         if(err){
//             return done(err);
//         }
function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    console.log(profile.id);
    User.find({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
        if(user){
            return done(null, user);
        } else {
            console.log(here);
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            console.log(newUser);
            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                return done(null, newUser);
            })
        }
    }
    ))


// ))