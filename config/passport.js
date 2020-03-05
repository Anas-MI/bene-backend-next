const LocalStrategy = require('passport-local').Strategy;
const db            = require('../config/database');
const User          = db.User;
const bcrypt        = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(
    {usernameField:'email',
    passwordField:'password'},
    function(email, password, done){
    // Match Username
 
    User.findOne({email:email, status:"active", $or: [
      { 'role': "admin" },
      { 'role': "superadmin" }
    ]}, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
