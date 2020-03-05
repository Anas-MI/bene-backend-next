const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const bcrypt = require('bcryptjs');
const passport = require('passport');
let User = require('../models/user');
let Setting = require('../models/setting');

router.get('/othersettings', ensureAuthenticated, function (req, res) {
    Setting.find({}, function(err, users){
        res.render('appsettings.hbs', {
            pageTitle: 'App Settings',
            setting:users
        });    
    }); 
});

router.post('/othersettings', async function (req, res){
    let transportrate = req.body.transportrate;
    let referaldiscount = req.body.refdiscount;
    let offeramout =  req.body.offeramout;
    req.checkBody('transportrate', 'Customer Name is required').notEmpty();
    req.checkBody('refdiscount', 'Broker Name is required').notEmpty();
    req.checkBody('offeramout', 'Order Offer Price is required').notEmpty();
    req.checkBody('offeramout', 'Order Offer Price Shuold be Number only').isNumeric();
    req.checkBody('transportrate', 'Transport Rate Shuold be Number only').isNumeric();
    req.checkBody('refdiscount', 'Reference Amount Shuold be Number only').isNumeric();
    let errors = req.validationErrors();
    if (errors) {
        res.json({ 'success': false, 'message': 'validation error', 'errors': errors });
    } else {
        var settingDate =  moment().tz("Asia/Kolkata");
        var startmiliseconds =  moment().tz("Asia/Kolkata").format('x');
        let setting = new Setting(); 
        setting.transportrate = transportrate;
        setting.referaldiscount = referaldiscount;
        setting.offeramout = offeramout;
        setting.settingchangedate = settingDate;
        setting.settingchangemiliseconds = startmiliseconds;
        const number = await Setting.count();
        if( number === 0){
            setting.save(function (err, obj) {
                if (err) {
                    res.json({ 'success': false, 'message': 'Error in Saving setting', 'errors': err });
                    return;
                } else {
                    res.json({ 'success': true, 'message': 'Settings added succesfully', 'obj': obj });
                }
            });
        } else {
            var settings = await Setting.findOne({});
            var settingid = settings._id;
            let query = {_id:settingid};
            let setting = {};
            setting.transportrate = transportrate;
            setting.referaldiscount = referaldiscount;
            setting.offeramout = offeramout;
            setting.settingchangedate = settingDate;
            setting.settingchangemiliseconds = startmiliseconds;
            let options = { new: true };
            Setting.findOneAndUpdate(query, setting, options, function(err, result){
                if(err){
                    res.json({ 'success': false, 'message': 'Error in Saving setting', 'errors': err });
                } else {
                    res.json({ 'success': true, 'message': 'Settings Updated succesfully', 'obj': result });
                }
            });
        }
    }
});

router.get('/getsettings', function (req, res) {
    Setting.find({}, function(err, users){
        if(err){
            res.json({ 'success': false, 'message': 'Error in fetching setting', 'errors': err });
        } else {
            res.json({ 'success': true, 'settings': users }); 
        }  
    }); 
});

router.get('/passwordsetting', ensureAuthenticated, function (req, res) {
    let message = req.query.pass;
    res.render('passwordsetting.hbs', {
        pageTitle: 'Password Settings',
        phonenumber:req.user.phonenumber,
        message:message
    }); 
});

router.post('/passwordsetting', function(req, res, next){
    let newpassword =  req.body.newpassword;
    let oldpassword = req.body.oldpassword;
    let phonenumber = req.user.phonenumber;
    req.checkBody('phonenumber', 'phonenumber is required').isNumeric();
    req.checkBody('phonenumber', 'phonenumber is required').notEmpty();
    req.checkBody('newpassword', 'Password is required').notEmpty();
    req.checkBody('oldpassword', 'Old Password is required').notEmpty();
    // res.json({ 'success': true, 'message': 'added successfully' });
    let errors = req.validationErrors();
    if(errors){
        // res.json({ 'success': false, 'message': "validation error", 'error': errors });
        res.render('passwordsetting.hbs', {
            pageTitle:'Password Settings',
            errors: errors
        });
    } else {
        User.findOne({phonenumber: phonenumber, status:"active"}, function(err, user){
            if(err) {
                // res.json({ 'success': false, 'message': "error in finding user", 'error': err });
                res.render('passwordsetting.hbs', {
                    pageTitle:'Password Settings',
                    errors: err
                });
            }
            if(!user){
                // res.json({ 'success': false, 'message': 'No user found' });
                res.render('passwordsetting.hbs', {
                    pageTitle:'Password Settings',
                    err: 'No user found'
                });
            } else {
                bcrypt.compare(oldpassword, user.password, function(err, isMatch){
                    if(err) throw err;
                    if(isMatch){
                        bcrypt.genSalt(10, function(err, salt){
                        bcrypt.hash(newpassword, salt, function(err, hash){
                            if(err){
                                res.render('passwordsetting.hbs', {
                                    pageTitle:'Password Settings',
                                    errors: err
                                });
                            }
                            let userobject = {};
                            userobject.password = hash;
                            let query = {phonenumber:phonenumber}
                            User.update(query, userobject, function(err, result){
                            if(err){
                                res.render('passwordsetting.hbs', {
                                    pageTitle:'Password Settings',
                                    errors: err
                                });
                                return;
                            } else {
                                req.flash('success', 'Successfully Change the password');
                                res.redirect('/settings/passwordsetting/?pass=1');
                            }
                            });
                        });
                        });
                    } else {
                        res.render('passwordsetting.hbs', {
                            pageTitle:'Password Settings',
                            err: 'You have Entered Wrong password'
                        });
                    }
                });
            }
        });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        req.session.returnTo = req.originalUrl;
        res.redirect('/users/login');
    }
}

module.exports = router;