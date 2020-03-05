const express = require('express');
const app = express();
const router = express.Router();
const db = require('../config/database');
const Affiliate = db.affiliation;
const Referral = require('../models/referralvisits')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path          = require('path');
const cloudinary    = require('cloudinary').v2;
const aws           = require('aws-sdk');
const algorithm = 'aes-256-cbc';
const multer        = require('multer');
const bodyParser    = require('body-parser');
var key = 'abcdefghijklmnopqrstuvwxyztgbhgf';
let iv = '1234567891234567';
const OOrder = require('../models/order');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
app.use(bodyParser.json());
let Creatives = require("../models/creatives");
// const oauth2Client = new OAuth2(
//     '1046438206668-j9jojvn8hcc3dd7d32p8fn1ed2g7vqbs.apps.googleusercontent.com', // ClientID
//     '5IyyBQxJI9I44XzoLbRv0AO3', // Client Secret
//     'https://developers.google.com/oauthplayground' // Redirect URL
// );
// //Refreshing the tokens
// oauth2Client.setCredentials({
//     refresh_token: '1/5TaFf1UzWmH10uDIuN1kBtieOvS6FO0mGRGxXxn9dwo'
// });
// // const tokens =  oauth2Client.refreshAccessToken()
// // const accessToken = tokens.credentials.access_token
// let tokens;
// let smtpTransport;
// oauth2Client.refreshAccessToken().then(function (res) {
//     if (!res.tokens && !res.credentials) {
//         throw Error('No access token returned.');
//     }
//     tokens = res.credentials;
//     console.log({ credentials: res.credentials });
//     console.log({ access: tokens.access_token });
//     smtpTransport = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             type: 'OAuth2',
//             user: 'admin@thirdessential.com',
//             clientId: '1046438206668-j9jojvn8hcc3dd7d32p8fn1ed2g7vqbs.apps.googleusercontent.com',
//             clientSecret: '5IyyBQxJI9I44XzoLbRv0AO3',
//             refreshToken: '1/5TaFf1UzWmH10uDIuN1kBtieOvS6FO0mGRGxXxn9dwo',
//             accessToken: tokens.access_token
//         }
//     });
//     // Runs my project-level function to store the tokens.
//     //   return setTokens(tokens);
// });

let smtpTransport = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
});

let sessionChecker = (req, res, next) => {

    console.log({usersession: req.session.user})
    
    console.log({usercookies: req.cookies.user_sid})
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        next();
    }
};


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({storage: storage,
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
    }});



//Register route for Ambassador Portal
router.post("/register", async  (req, res) => {
    // validate the input
    req.checkBody('firstname', 'First Name is required').notEmpty();
    req.checkBody('lastname', 'Last Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('phonenumber', 'Phone Number is required').notEmpty();
        // check the validation object for errors
    let errors = req.validationErrors();
    if (errors) {
        res.json({ status: false, messages: errors });
    } else {
        // validate
        if (await Affiliate.findOne({ email: req.body.email })) {
            res.status(200).json({
                status: false,
                error: 'Email ' + req.body.email + ' is already taken'
            });
        } else if (req.body.password !== req.body.password2) {
            res.status(200).json({ status: false, error: 'Passwords Do Not Match' });
        } else {
            // hashing the password
            let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
            var encrypted =
                cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

            let extention = req.body.firstname;
            extention += req.body.lastname;

            const ambass_id = Math.floor(Math.random() * 8999 + 1000);

            console.log(req.body);
            const affiliate = new Affiliate({
                fname: req.body.firstname,
                lname: req.body.lastname,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                profession: req.body.profession,
                website: req.body.website,
                instagram: req.body.instagram,
                facebook: req.body.facebook,
                zipcode: req.body.zipcode,
                networksize: req.body.networksize,
                why: req.body.why,
                password: encrypted,
                extention,
                ambass_id
            });
            // user.password = bcrypt.hashSync(userParam.password, 10);
            // save user
            await affiliate.save().then((data) => setdata(data));
            async function setdata(user) {

                res.status(200).json({ status: true, user })
                var mailOptions = {
                    from: '"CBD Bene" <admin@cbdbene.com>',
                    to: req.body.email,
                    subject: 'Registration Complete - CBDBene',
                    text: "You have been successfully registered as an Ambassador on CBDBene. You can log into the Ambassador Portal once we approve you. Keep an eye on your inbox."
                };
        
                
                smtpTransport.sendMail(mailOptions, (error, response) => {
                
                    if (error) {
                        console.log(error);
                
                    } else {
                        console.log(response);
                        smtpTransport.close();
                    }})
                
                
                //     var mailOptions = {
                //         from: 'anas3rde@gmail.com',
                //         to: req.body.email,
                //         subject: 'Successfully Registered - CBD Bene',
                //         text: "You've been succesfully registered as an Ambassador on CBD Bene. "
                //     };

                //     smtpTransport.sendMail(mailOptions, function(err) {
                //         if (err) {
                //         }
                //         console.log('Registration email sent ');
                //     });
                // }
            }
        }
    }})
//Login route
router.post("/login", (req, res) => {
    req.checkBody('email', 'Email is required').notEmpty();
    //req.checkBody('email', 'Email does not appear to be valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    // check the validation object for errors
    let errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, messages: errors });
    } else {
        let email = req.body.email;
        let password = req.body.password;
        let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
        var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
        Affiliate.findOne({ email }).populate("urlvisits").then(function (user) {
            app.get(sessionChecker, (req, res) => {
                //  res.json({ status: "session stored" });
            });
            //Checking if user exists or not
            if (!(user == null)) {
                if (encrypted != user.password) {
                    res.json({ status: false, error: 'Password Incorrect' });
                } else if (user) {
                    if(user.status === true){
                    req.session.user = user;
                    req.session.Auth = user;
                    res.json({
                        status: true,
                        user: req.session.Auth
                    })} else {
                        res.json({status: false, message: "User not active"})
                    };
                }
            } else {
                res.json({ status: false, message: 'User not found' });
            }
        });
    }
})

//body 
//firstname
//lastname

//body for url visits{
//url
//referringurl
//
//date

router.post("/add/url", async function (req, res) {
    let ambass_id = req.body.ambass_id
    let isvalid =  Affiliate.findOne({ambass_id});

    if(await isvalid){
    let referral = new Referral({
        url: req.body.url,
        refer_url: req.body.refer_url,
       ambass_id,
    })

    referral.save().then((data) => addit(data)).catch((err) => res.status(400).json({ status: false, error: err }))
    function addit(referral) {
        Affiliate.findOneAndUpdate({ ambass_id }, { $push: { urlvisits: referral._id } },{new: true}).populate("urlvisits").then((data) => res.status(200).json({ status: true, data, referral })).catch((err) => res.status(400).json({ status: false, error: err }))
    }
} else {
    res.json({status: false,error:"No such Ambassador"})
}})

router.post("/convert/:id", async function(req, res){
    let id = req.params.id;
    let amount = req.body.amount;
    let orderid = req.body.orderid
    Referral.findByIdAndUpdate(id, {$set: {converted: true, orderid, amount}}, {new: true}).then((data) => res.status(200).json({status: true, data})).catch((err) => res.status(400).json({status: false, error: err}))
});

router.get("/stats/:id", async function(req, res){
    let ambass_id = req.params.id;
    Affiliate.findOne({ambass_id}).populate("urlvisits").then((data) => res.status(200).json({status: true, data})).catch((err) => res.json({status: false, error: err }));
})

router.post("/update", async function(req, res){

let id = req.body.id;

let affl={}
 if(req.body.firstname){   
affl.fname = req.body.firstname}
if(req.body.lastname){
affl.lname = req.body.lastname}
if(req.body.email){
affl.email = req.body.email}
if(req.body.password){
affl.password = req.body.password}
if(req.body.phonenumber){
affl.phonenumber = req.body.phonenumber}
if(req.body.profession){
affl.profession = req.body.profession}
if(req.body.website){
affl.website = req.body.website}
if(req.body.instagram){
affl.instagram = req.body.instagram}
if(req.body.facebook){
affl.facebook = req.body.facebook}
if(req.body.zipcode){
affl.zipcode = req.body.zipcode}
if(req.body.account){
affl.account = req.body.account}
if(req.body.bank){
affl.bank = req.body.bank}
if(req.body.tax){
affl.tax = req.body.tax}

Affiliate.findByIdAndUpdate(id, affl, {new: true}).then((data) => res.json({status: true, data})).catch((err) => res.json({status: false, error: err}))});

//Display all the referrals
router.get("/allreferrals", ensureAuthenticated, async (req, res) => {
   let referral = await Referral.find().sort({date: "desc"})
   res.render("allreferral.hbs", {referral})
})

//referralview
router.get("/referralview/:id", ensureAuthenticated, async (req, res) => {
    let id = req.params.id;
   let affiliate = await Affiliate.findOne({urlvisits: {_id: id}}).populate("urlvisits").then((data) => display(data));

   function display(data){
    res.status(200).render('view_ambass.hbs', {
        pageTitle: 'View Ambass',
        user: data
    });   
}   
})

function ensureNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl;
		res.redirect('/');
	}
}

function ensureAuthenticated(req, res, next) {
    
    if(req.user){
        console.log("User is authenticated")
    } else {
        console.log("not authenticated")
    }
    
    
    if (req.user) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl;
		res.redirect('/users/login');
	}
}

//Backend managemnet for affiliation 
router.get('/usermanagement', ensureAuthenticated, async function(req, res) {
	Affiliate.find({}).then((data) => show(data));
	function show(data) {
		res.status(200).render('all_ambassadors.hbs', {
			pageTitle: 'All Ambassadors',
			user: data
		});
	}
});
router.get("/view/:id", ensureAuthenticated, async function(req, res){
    let query = req.params.id;
	Affiliate.findById(query).populate("urlvisits").then((data) => show(data));
	function show(data) {
		res.status(200).render('view_ambass.hbs', {
			pageTitle: 'View Ambass',
			user: data
		});
	}
})

router.post("/register/admin", ensureAuthenticated, async function(req,res){
    if (await Affiliate.findOne({ email: req.body.email })) {
        res.status(200).json({
            status: false,
            error: 'Email ' + req.body.email + ' is already taken'
        });
    } else if (req.body.password !== req.body.password2) {
        res.status(200).json({ status: false, error: 'Passwords Do Not Match' });
    } else {
        // hashing the password
        let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
        var encrypted =
            cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
        let extention = req.body.firstname;
        extention += req.body.lastname;

        const ambass_id = Math.floor(Math.random() * 8999 + 1000);
        console.log(req.body);
        const affiliate = new Affiliate({
            fname: req.body.firstname,
            lname: req.body.lastname,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            profession: req.body.profession,
            website: req.body.website,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
            zipcode: req.body.zipcode,
            networksize: req.body.networksize,
            status: req.body.status,
            why: req.body.why,
            password: encrypted,
            extention,
            ambass_id
        });
        affiliate.save().then((data) => res.redirect("/ambassador-portal/usermanagement")).catch((err) => res.json({status: false, error: err}))
        
    }});

    //Mark as paid route
router.get("/pay/:id", ensureAuthenticated, (req, res) => {
        let id = req.params.id;
        let url = "/ambassador-portal/referralview/" + id;
        Referral.findByIdAndUpdate(id, {$set: {
            paid: true, 
            paidon: Date.now()
        }}).then((data) => res.redirect(url));
    });

//apporve ambasador route 
router.get("/approve/:id", ensureAuthenticated, (req, res) => {
    let id = req.params.id;
    Affiliate.findByIdAndUpdate(id, {$set: {status: true}}).then((data) => sendmail(data));
    
    function sendmail(data){
    var mailOptions = {
        from: '"CBD Bene" <admin@cbdbene.com>',
        to: data.email,
        subject: 'Ambassador Program - CBDBene',
        text: "We’re so happy to officially welcome you to the CBD Bene Ambassador Team. You can login to our portal at any time to view your activity, track commissions, share and more."
    };

    
    smtpTransport.sendMail(mailOptions, (error, response) => {
    
        if (error) {
            console.log(error);
    
        } else {
            console.log(response);
            smtpTransport.close();
        }})
        res.redirect("/ambassador-portal/usermanagement")

}});

router.get("/approve1/:id", ensureAuthenticated, (req, res) => {
    let id = req.params.id;
    let url = "/ambassador-portal/view/" + id
    Affiliate.findByIdAndUpdate(id, {$set: {status: true}}).then((data) => res.redirect(url));
});


router.get("/disapprove/:id", ensureAuthenticated, (req, res) => {
    let id = req.params.id;
    let url = "/ambassador-portal/view/" + id
    Affiliate.findByIdAndUpdate(id, {$set: {status: false}}).then((data) => res.redirect(url));
});


//get creatives link 
router.get("/creatives", ensureAuthenticated, async (req, res) => {
    let creative = await Creatives.find()
    res.render("creatives.hbs", {creative})
}) 

router.post("/creatives/add", upload.any(), (req, res) => {
//console.log(req.files)
//if(req.files){
//let photo = {};
//req.files.map( (item, index)=> {
      //  if(item.fieldname == 'image') {
    //        photo.featureimage = item.path;
  //      }})
//let body = {...req.body, image:photo.featureimage}    
let creative = new Creatives(req.body)
	
    creative.save().then(() => res.redirect("/ambassador-portal/creatives"))
});

router.get("/creatives/delete/:id", ensureAuthenticated, (req, res) => {
    Creatives.findByIdAndRemove(req.params.id).then(() => res.status(200).json({status: true}))
});


//Forhget password link 
router.post('/forgetpassword', async function(req, res, next) {
	if (req.body.firststep) {
		req.checkBody('email', 'email is required').notEmpty();
		let errors = req.validationErrors();
		if (errors) return res.status(404).json({ success: false, message: 'validation error' });

		let userExist = await Affiliate.findOne({ email: req.body.email }, 'email', function(
			err,
			user
		) {});
		if (!userExist) {
			return res.status(404).json({ success: false, message: 'No user found' });
		} else {
			// var transporter = nodemailer.createTransport({
			// 	service: 'gmail',
			// 	auth: {
			// 		user: 'admin@thirdessential.com',
			// 		pass: 'thirdessential@21'
			// 	}
			// });

			var url = process.env.serverurl + '/ambassador-portal/update-password/?token=' + userExist._id;
		}
		var userEmail = userExist.email;
		var emailText = 'Please click on the link below to reset your password - CBDBene';
		emailText += '<p><a href="' + url + '">Click Here</a>';
		var mailOptions = {
			from: '"CBD Bene" <admin@cbdbene.com>',
			to: userEmail,
			subject: 'Forget Password Link - CBDBene',
			html: emailText
		};

		// smtpTransport = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		type: 'OAuth2',
		// 		user: 'admin@thirdessential.com',
		// 		clientId:
		// 			'1046438206668-j9jojvn8hcc3dd7d32p8fn1ed2g7vqbs.apps.googleusercontent.com',
		// 		clientSecret: '5IyyBQxJI9I44XzoLbRv0AO3',
		// 		refreshToken: '1/5TaFf1UzWmH10uDIuN1kBtieOvS6FO0mGRGxXxn9dwo',
		// 		accessToken: tokens.access_token
		// 	}
		// });

		smtpTransport.sendMail(mailOptions, (error, response) => {
			console.log(here);
			if (err) {
				console.log(error);
				return res.status(404).json({ success: false, message: error });
			} else {
				console.log(response);
				return res.status(200).json({ success: true, message: 'Email successfully sent' });
				smtpTransport.close();
			}
		});
		res.json({ status: true });
		
	} else {
		// req.checkbody('userid', "Userid is required").notEmpty();
		// req.checkBody('newpassword', 'Password is required').notEmpty();
		// let errors = req.validationErrors();
		// if (errors) return res.status(404).json({ success: false, message: 'validation error' });
		let userPassExist = await Affiliate.findOne(
			{ _id: req.body.userid },
			function(err, user) {}
		);
		if (!userPassExist) {
			return res.status(404).json({ success: false, message: 'No user found' });
		} else {
			// let hashPass = bcrypt.hashSync(req.body.newpassword, 11);
			let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
			var encrypted =
				cipher.update(req.body.newpassword, 'utf8', 'hex') + cipher.final('hex');
			let userobject = {};
			userobject.password = encrypted;
			let query = { _id: req.body.userid };
			Affiliate.update(query, userobject, function(err) {
				if (err) {
					return res.status(404).json({ success: false, message: err });
				} else {
					return res.status(200).json({
						success: true,
						message: 'Your password has been succesfully changed'
					});
				}
			});
		}
	}
});

router.get("/creatives/api/all", async (req, res) => {
    let creative = await Creatives.find()
    res.send({creative})
    }) 

//get route for statistics
router.get("/statistics", async (req, res) => {
    
//Calculating the number of visits
let referral = await Referral.find();
let visits = referral.length

console.log({visits})

//Calculating the number of Products sold 

let orders = await OOrder.find({wasReferred: true}).populate("products") 
let productsArr = [];

let products = orders.map((el) => {
    el.products.map((el2) => {
        productsArr.push(el2)
    })

})


 let productsSold = productsArr.map(products => {console.log(products.converted)
     if(!products.comboId){return products}}).filter(notUndefined => notUndefined !== undefined);

     console.log({"products sold" : productsSold.length});

// calculating the number of kits sold
let kitsSold = productsArr.map(kits => {if(kits.comboId){return kits}}).filter(notUndefined => notUndefined !== undefined);

console.log({"Bundles sold" : kitsSold.length});

// //calculating the total number of products sold
// let totalProductsSold = referral.map(sold => {if(sold.converted === true) return sold })

// Number of links comverted
let totalLinks = referral.map(links => {if(links.converted === true) return links}).filter(notUndefined => notUndefined !== undefined);

console.log({"Total Links Converted" : totalLinks.length})

// Best selling product
let bestSelling = productsSold.map(bestSelling => { return bestSelling.title})

console.log(bestSelling)
let  count1 = {};
 bestSelling.forEach(function(i) { count1[i] = (count1[i]||0) + 1;});
 console.log({count1});

 //Best selling kit 
 let bestSellingKit = kitsSold.map(bestSelling => { return bestSelling.title})
 let count2 = {};
bestSellingKit.forEach(function(el) { count2[el] = (count2[el]||0) + 1; })
console.log({count2})

let productsSold1 = productsSold.length

//setTimeout(function(){ res.render("statistics.hbs", {visits, productsSold: productsSold1, kitsSold: kitsSold.length, orders: orders.length}); }, 1500);
res.render("statistics.hbs", {visits, productsSold: productsSold1, kitsSold: kitsSold.length, orders: orders.length, count1, count2});
});

module.exports = router;