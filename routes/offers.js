const express = require('express');
const router = express.Router();
var aws = require('aws-sdk');
var bodyParser = require('body-parser');
var multer = require('multer');
var multerS3 = require('multer-s3');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const https = require('https');
let Product = require('../models/product');
let Offer = require('../models/offer');
let Notification = require('../models/notification');
let User = require('../models/user');
aws.config.update({
    secretAccessKey: '8C9jSK5K8URFv+FhCHPHceprydP4v9TE5q+qSfkq',
    accessKeyId: 'AKIAIEXHVVF45KDJQPVA',
    region: 'us-east-2'
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'elasticbeanstalk-us-east-2-797993184252',
        metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-bd-' + file.originalname);
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true)
    },
    limits:{
        fileSize: 420 * 150 * 200
    }
});



router.get('/add', ensureAuthenticated, function (req, res) {
    Product.find({}, function (err, products) {
        if (err) {
            console.log(err);
        } else {
            res.render('add_offer.hbs', {
                pageTitle: 'Add Offer',
                products:products
            });  
        }
    });
});


router.post('/add', upload.single('offerimage'), async function(req, res, next) {
    req.checkBody('productname', 'Product Name is required').notEmpty();
    req.checkBody('offerinfo', 'Offer Info is required').notEmpty();
    req.checkBody('priceoffer', 'Price Offer is required').notEmpty();
    req.checkBody('maxlimituser', 'Maximum Limit for user is required').notEmpty();
    req.checkBody('offersize', 'Offer Size is required').notEmpty();
    req.checkBody('offerstartdate', 'Offer Start Date is required').notEmpty();
    req.checkBody('offerenddate', 'Offer End Date is required').notEmpty();
    req.checkBody('offerstarttime', 'Offer Start Time is required').notEmpty();
    req.checkBody('offerendtime', 'Offer End Time is required').notEmpty();
    let errors = req.validationErrors();
    var offerstartDate = req.body.offerstartdate;
    var offerstartTime = req.body.offerstarttime;
    var offerstartDateTime = offerstartDate+" "+offerstartTime;
    var offerstartDateObject =  moment(offerstartDateTime, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
    var offerEndDate = req.body.offerenddate;
    var offerEndTime = req.body.offerendtime;
    var offerEndDateTime = offerEndDate+" "+offerEndTime;
    var offerEndDateObject = moment(offerEndDateTime, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
    var offerStartDateMiliSeconds = offerstartDateObject.format('x');
    var offerEndDateMiliSeconds = offerEndDateObject.format('x');
    if (errors) {
        if(req.file) {
            let filename = req.file.location;
            var params = {
                Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                Key: filename
            };
            s3.deleteObject(params, function (err, data) {
                if (data) {
                    console.log("File deleted successfully");
                }
                else {
                    console.log("Check if you have sufficient permissions : "+err);
                }
            });
        }
        res.render('add_offer.hbs', {
            title: 'Add Offer',
            errors: errors
        });
    } else {
        if (req.fileValidationError) {
            res.render('add_offer.hbs', {
                title: 'Add Offer',
                errors: req.fileValidationError
            });     
        } else {
            let offer = new Offer();
            offer.productname = req.body.productname;
            offer.offerproductid = req.body.offerproductid;
            offer.productbrand = req.body.productbrand;
            offer.pack = req.body.pack;
            offer.offerinfo = req.body.offerinfo;
            offer.priceoffer = req.body.priceoffer;
            offer.maxlimituser = req.body.maxlimituser;
            offer.maxlimituserunit = req.body.maxlimituserunit;
            offer.offerstartdate = offerstartDateObject;
            offer.offerenddate = offerEndDateObject;
            offer.startdatemiliseconds = offerStartDateMiliSeconds;
            offer.enddatemiliseconds = offerEndDateMiliSeconds;
            offer.offersizeunit = req.body.offersizeunit;
            offer.offersize = req.body.offersize;
            offer.offerremaingquantity = 0;
            offer.priceofferunit = req.body.priceofferunit;
            offer.priceofferapplied = req.body.priceofferapplied;
            if(req.file) {
                offer.filepath = req.file.location;
                offer.filename = req.file.key;
            }
            offer.save(async function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    let userDetails = await User.find({status:"active", $or: [
                        { 'role': "customer" },
                        { 'role': "broker" }
                      ]}, function(err, users){});
                    let userFlagObj = {};
                    for (let index = 0; index < userDetails.length; index++) {
                        userFlagObj[userDetails[index]._id] = 0;
                    }
                    let userid = req.user._id;
                    let title = "Offer Added";
                    let offermessage = req.body.priceoffer+' '+req.body.priceofferunit+' '+req.body.priceofferapplied+' off on '+req.body.productname+' '+req.body.productbrand+' '+req.body.pack+' Kg till '+req.body.offerenddate+' with Max offer of '+req.body.offersize+' '+req.body.offersizeunit;
                    let notificationtime = moment().tz("Asia/Kolkata").format('x');
                    let type = "All";
                    let flag = 0;
                    let notification = new Notification();
                    notification.title = title;
                    notification.content = offermessage;
                    notification.type = type;
                    notification.notificationtime = notificationtime;
                    notification.readflag = flag;
                    notification.readflagall = userFlagObj;
                    notification.userid = userid;
                    notification.save(function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log('notification saved successfully');
                        }
                    });
            
                    var message = { 
                        app_id: "5797bcb1-162e-4d2d-bb22-48a756b7e340",
                        headings: {"en": title, "es": title},
                        contents: {"en": offermessage, "es": "Spanish Message"},
                        included_segments: ["Active Users"]
                    };
                    sendNotification(message);
                    req.flash('success', 'Offer Added');
                    res.redirect('/offers/all');
                }
            });
        }
    }
});

router.post('/updatenotificationall', async function(req, res, next) { 
    let notificationDetails = await Notification.find({type: "All"}, function(err, users){});
    let userid = req.body.userid;
    for (let index = 0; index < notificationDetails.length; index++) {
        notificationDetails[index].readflagall[userid] = 1;
        let notificationId = notificationDetails[index]._id;
        let readFlagAll = notificationDetails[index].readflagall;
        let notification = {};
        notification.readflagall = readFlagAll;
       let query = {_id:notificationId}
       Notification.update(query, notification, function(err){
          if(err){
            console.log(err);
            res.json({ 'success': false, 'error': err });
          } else {
            console.log("notification update successfully");
          }
        });
    }
    res.json({ 'success': true, 'notification': "notification update successfully" });  
});

router.post('/updatenotificationspecific', async function(req, res, next) {  
    let userid = req.body.userid;
    let notification = {};
    notification.readflag = 1;
    let query = {userid:userid, type: "Specific"}
    Notification.update(query, notification, function(err){
        if(err){
            console.log(err);
            res.json({ 'success': false, 'error': err });
        } else {
            res.json({ 'success': true, 'notification': "notification update successfully" });
        }
    });  
});




router.get('/all', ensureAuthenticated, function (req, res) {
    const startmiliseconds = moment().tz("Asia/Kolkata").startOf('month').format('x');
    const endmiliseconds   = moment().tz("Asia/Kolkata").endOf('month').format('x');
    // Offer.find({$and: [{startdatemiliseconds:{$gte:startmiliseconds}},{startdatemiliseconds:{$lte:endmiliseconds}}]}, function (err, offers) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render('all_offers.hbs', {
    //             pageTitle: 'All Offers',
    //             offers: offers
    //         });
    //     }
    // }).sort({_id: 'asc'});
    Offer.find({$and: [{startdatemiliseconds:{$gte:startmiliseconds}},{startdatemiliseconds:{$lte:endmiliseconds}}]}).populate('offerproductid').sort({_id: 'desc'}).exec(function (err, offers) {
        if(err) {
            console.log(err);
        } else {
            res.render('all_offers.hbs', {
                pageTitle: 'All Offers',
                offers: offers
            });
        }
    });
});


router.post('/all', function (req, res) {
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    const startmiliseconds = moment(startdate, "DD/MM/YYYY").tz("Asia/Kolkata").format('x');
    const endmiliseconds = moment(enddate, "DD/MM/YYYY").tz("Asia/Kolkata").format('x');
    // Offer.find({$and: [{startdatemiliseconds:{$gte:startmiliseconds}},{startdatemiliseconds:{$lte:endmiliseconds}}]}, function (err, offers) {
    //     if (err) {
    //         res.json({ 'success': false, 'error': err });
    //     } else {
    //         res.json({ 'success': true, 'offers': offers });
    //     }
    // }).sort({_id: 'asc'});
    Offer.find({$and: [{startdatemiliseconds:{$gte:startmiliseconds}},{startdatemiliseconds:{$lte:endmiliseconds}}]}).populate('offerproductid').sort({_id: 'desc'}).exec(function (err, offers) {
        if(err) {
            res.json({ 'success': false, 'error': err });
        } else {
            res.json({ 'success': true, 'offers': offers });
        }
    });
});


router.get('/getproductbrandbyid', function (req, res) {
    if( req.query.id ) {
        Product.findById(req.query.id, 'productbrand', function(err, product){
            res.json({ 'success': true, 'product': product });
        });
    }
});

router.get('/getalloffer', function (req, res) {
    if(req.query.currenttime) {
        var currentTimeoffset = req.query.currenttime;
    } else {
        var currentTimeoffset = moment().tz("Asia/Kolkata").format('x');
    }
    Offer.find({$and: [{startdatemiliseconds:{$lte:currentTimeoffset}},{enddatemiliseconds:{$gte:currentTimeoffset}}]}).populate('offerproductid').sort({_id: 'desc'}).exec(function (err, offers) {
        if(err) {
            res.json({ 'success': false, 'message': err });
        } else {
            res.json({ 'success': true, 'offers': offers });
        }
    });
});

router.get('/getofferbyproductid', function (req, res) {
    if( req.query.productid ) {
        if(req.query.currenttime) {
            var currentTimeoffset = req.query.currenttime;
        } else {
            var currentTimeoffset = moment().tz("Asia/Kolkata").format('x');
        }
        Offer.find({offerproductid: req.query.productid, $and: [{startdatemiliseconds:{$lte:currentTimeoffset}},{enddatemiliseconds:{$gte:currentTimeoffset}}]}).
        populate('offerproductid').
        sort({_id: 'desc'}).
        exec(function (err, offers) {
            if(err) {
                res.json({ 'success': false, 'message': err });
            } else {
                res.json({ 'success': true, 'offers': offers });
            }
        });
    } else {
        res.json({ 'success': false, 'message': 'Product Id is empty' });
    }
});

router.get('/getofferbyid', function(req, res){
    if( req.query.offerid ) {
        Offer.findById(req.query.offerid).populate('offerproductid').exec(function (err, offer) {
            if(err) {
                console.log(err);
            } else {
                    res.json({ 'success': true, 'offers': offer });
            }
        });
    }
});

router.get('/offerquantityupdate', function (req, res) {
    if( req.query.offerid && req.query.quantity ) {
        let offer = {};
        
        let query = {_id:req.query.offerid};
        Offer.findById(req.query.offerid, function(err, offerdetail){
            if (err) {
                res.json({ 'success': false, 'message': err });
            } else {
                let offerremainquantity = offerdetail.offerremaingquantity;
                offer.offerremaingquantity = offerremainquantity + req.query.quantity;
                Offer.update(query, offer, function(err){
                    if(err){
                        res.json({ 'success': false, 'message': err });
                    } else {
                        res.json({ 'success': true, 'message': 'quantity updates successfully' });
                    }
                });
            }
        });
    } else {
        res.json({ 'success': false, 'message': 'Either Offer Id or Update quantity is missing' });
    }
});


router.get('/:id', ensureAuthenticated, function(req, res){
    Offer.findById(req.params.id).populate('offerproductid').exec(function (err, offer) {
        if(err) {
            console.log(err);
        } else {
            res.render('offer_single.hbs', {
                pageTitle: 'Offer',
                offer:offer
            });
        }
    });
});

router.get('/edit/:id', function(req, res){
    Offer.findById(req.params.id).populate('offerproductid').exec(function (err, offer) {
        Product.find({}, function (err, products) {
            if (err) {
                console.log(err);
            } else {
                res.render('edit_offer.hbs', {
                    pageTitle:'Edit Offer',
                    offer: offer,
                    products: products
                });
            }
        });
    });
});

router.post('/edit/:id', upload.single('offerimage'), function(req, res){
    req.checkBody('productname', 'Product Name is required').notEmpty();
    req.checkBody('offerinfo', 'Offer Info is required').notEmpty();
    req.checkBody('priceoffer', 'Price Offer is required').notEmpty();
    req.checkBody('maxlimituser', 'Maximum Limit for user is required').notEmpty();
    req.checkBody('offersize', 'Offer Size is required').notEmpty();
    req.checkBody('offerstartdate', 'Offer Start Date is required').notEmpty();
    req.checkBody('offerenddate', 'Offer End Date is required').notEmpty();
    req.checkBody('offerstarttime', 'Offer Start Time is required').notEmpty();
    req.checkBody('offerendtime', 'Offer End Time is required').notEmpty();
    let errors = req.validationErrors();
   
    if (errors) {
        console.log(errors);
        if(req.file) {
            let filename = req.file.location;
            var params = {
                Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                Key: filename
            };
            s3.deleteObject(params, function (err, data) {
                if (data) {
                    console.log("File deleted successfully");
                }
                else {
                    console.log("Check if you have sufficient permissions : "+err);
                }
            });
        }
        res.render('edit_offer.hbs', {
            title: 'Edit Offer',
            errors: errors
        });
    } else {
        if (req.fileValidationError) {
            console.log(`fileValidationError ${fileValidationError}`);
            res.render('edit_offer.hbs', {
                title: 'Edit Offer',
                errors: req.fileValidationError
            });     
        } else {
            let offer = {};
            offer.productname = req.body.productname;     
            if( req.body.productbrand ) {
                offer.productbrand = req.body.productbrand;     
            } else {
                offer.productbrand = req.body.previousproductbrand;
            }
           
            var offerstartDate = req.body.offerstartdate;
            var offerstartTime = req.body.offerstarttime;
            var offerstartDateTime = offerstartDate+" "+offerstartTime;
            var offerstartDateObject =  moment(offerstartDateTime, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
            var offerEndDate = req.body.offerenddate;
            var offerEndTime = req.body.offerendtime;
            var offerEndDateTime = offerEndDate+" "+offerEndTime;
            var offerEndDateObject = moment(offerEndDateTime, "DD/MM/YYYY hh:mm a").tz("Asia/Kolkata");
            var offerStartDateMiliSeconds = offerstartDateObject.format('x');
            var offerEndDateMiliSeconds = offerEndDateObject.format('x');
            
            offer.pack = req.body.pack;
            offer.offerinfo = req.body.offerinfo;
            offer.priceoffer = req.body.priceoffer;
            offer.offerproductid = req.body.offerproductid;
            offer.maxlimituser = req.body.maxlimituser;
            offer.maxlimituserunit = req.body.maxlimituserunit;
            offer.offerstartdate = offerstartDateObject;
            offer.offerenddate = offerEndDateObject;
            offer.startdatemiliseconds = offerStartDateMiliSeconds;
            offer.enddatemiliseconds = offerEndDateMiliSeconds;
            offer.offersizeunit = req.body.offersizeunit;
            offer.offersize = req.body.offersize;
            offer.priceofferunit = req.body.priceofferunit;
            offer.priceofferapplied = req.body.priceofferapplied;
            if(req.file) {
                offer.filepath = req.file.location;
                offer.filename = req.file.key;
                var previousFilename = req.body.previousfilename;
                var params = {
                    Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                    Key: previousFilename
                };
                s3.deleteObject(params, function (err, data) {
                    if (data) {
                        console.log("File deleted successfully");
                    }
                    else {
                        console.log("Check if you have sufficient permissions : "+err);
                    }
                });
            }
            let query = {_id:req.params.id}
            Offer.update(query, offer, function(err){
                if(err){
                    console.log(`update error one ${err}`);
                    res.render('edit_offer.hbs', {
                        title: 'Edit Offer',
                        errors: err
                    });
                } else {
                    req.flash('success', 'Offer Updated');
                    res.redirect('/offers/'+req.params.id);
                }
            });
        } 
    }
  });

  router.delete('/:id', function(req, res){
    if(!req.user._id){
      res.status(500).send();
    }
    let query = {_id:req.params.id}
    Offer.findById(req.params.id, function(err, offer){
        Offer.remove(query, function(err){
          if(err){
            console.log(err);
          }
          res.send('Success');
        });
    });
});

var sendNotification = function(data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic OTk2N2VkZmEtMDY0NS00MDAwLWE0MzItOWFlZTliZmUzN2Uz"
    };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };
  
// Access Control
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