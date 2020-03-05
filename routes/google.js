const express           = require('express');
const router            = express.Router();
const passport = require("passport");

// router.get('/auth/google', function(req, res){
//     passport.authenticate('google', {
//         successRedirect: '//options/all',
//         failureRedirect: '/users/register',
//         failureFlash: true
//     })
// });



// router.get('/auth/google/callback', function(req, res){
//     passport.authenticate('google', {
//         scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
//     })
// });

//Test
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']  }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });




module.exports = router;