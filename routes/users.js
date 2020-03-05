const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../config/database');
// const userService   = require('../service/user.service');
const User2 = require('../models/user2');
const Usermeta2 = require('../models/usermeta2');
const session = require('express-session');
const User = db.User;
const UserMeta = db.UserMeta;
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var key = 'abcdefghijklmnopqrstuvwxyztgbhgf';
let iv = '1234567891234567';
let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
const { google } = require('googleapis');

let smtpTransport = nodemailer.createTransport({
    host: 'localhost',
    port: 25,
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
});

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
// 	'1046438206668-j9jojvn8hcc3dd7d32p8fn1ed2g7vqbs.apps.googleusercontent.com', // ClientID
// 	'5IyyBQxJI9I44XzoLbRv0AO3', // Client Secret
// 	'https://developers.google.com/oauthplayground' // Redirect URL
// );

// //Refreshing the tokens
// oauth2Client.setCredentials({
// 	refresh_token: '1/5TaFf1UzWmH10uDIuN1kBtieOvS6FO0mGRGxXxn9dwo'
// });
// // const tokens =  oauth2Client.refreshAccessToken()
// // const accessToken = tokens.credentials.access_token
// let tokens;
// let smtpTransport;
// oauth2Client.refreshAccessToken().then(function(res) {
// 	if (!res.tokens && !res.credentials) {
// 		throw Error('No access token returned.');
// 	}
// 	tokens = res.credentials;
// 	console.log({ credentials: res.credentials });
// 	console.log({ access: tokens.access_token });
// 	smtpTransport = nodemailer.createTransport({
// 		service: 'gmail',
// 		auth: {
// 			type: 'OAuth2',
// 			user: 'admin@thirdessential.com',
// 			clientId: '1046438206668-j9jojvn8hcc3dd7d32p8fn1ed2g7vqbs.apps.googleusercontent.com',
// 			clientSecret: '5IyyBQxJI9I44XzoLbRv0AO3',
// 			refreshToken: '1/5TaFf1UzWmH10uDIuN1kBtieOvS6FO0mGRGxXxn9dwo',
// 			accessToken: tokens.access_token
// 		}
// 	});
// 	// Runs my project-level function to store the tokens.
// 	//   return setTokens(tokens);
// });

//creating a nodemailer service transport

router.get('/register', function(req, res) {
	res.render('register.hbs', {
		pageTitle: 'Sign up'
	});
});

let sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		res.redirect('/');
	} else {
		next();
	}
};

//edit user route
router.get('/edit/:id', async function(req, res) {
	let query = req.params.id;
	User2.findById(query).then((data) => show(data));
	async function show(data) {
		let usermeta = await Usermeta2.findOne({userid: data._id})
		res.status(200).render('view_user.hbs', {
			pageTitle: 'View User',
			user: data,
			usermeta
		});
	}
});

// APi login route
router.post('/api/login', async function(req, res) {
	if (req.body.facebook) {
		User2.findOne({ facebook: req.body.facebook }).then((data) => check(data));
		let checkIfExists = await User2.findOne({email: req.body.email})
		if(checkIfExists.length === 0){
		async function check(data) {
			if (data == null) {
				res.json({ status: false, message: 'User not found' });
			} else {
				let userid = data._id
				let usermeta = await Usermeta2.findOne({userid});
				res.json({ status: true, user: data, usermeta });
			}
		}} else {
			res.json({status: true, user: checkIfExists})
		}
	} else if (req.body.google) {
		let checkIfExists = await User2.findOne({email: req.body.email});
		if(checkIfExists.length === 0){
		console.log(req.body);
		User2.findOne({ google: req.body.google }).then((data) => check(data));
		async function  check(data) {
			console.log(data);
			if (data == null) {
				res.json({ status: false, message: 'User not found' });
			} else {
				let userid = data._id
				let usermeta = await Usermeta2.findOne({userid});
				res.json({ status: true, user: data, usermeta});
			} 
		}} else {
      res.json({status: true, user: checkIfExists})
    }
	} else {
		// validate the input
		req.checkBody('email', 'Email is required').notEmpty();
		// req.checkBody('email', 'Email does not appear to be valid').isEmail();
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
			User2.findOne({ email: email }).then(async function(user) {
				app.get(sessionChecker, (req, res) => {
					//  res.json({ status: "session stored" });
				});
				//Checking if user exists or not
				if (!(user == null)) {
					if (encrypted != user.password) {
						res.json({ status: false, error: 'Password Incorrect' });
					} else if (user) {
						req.session.user = user;
						req.session.Auth = user;
						let userid = user._id;
						let usermeta = await Usermeta2.findOne({userid});
						res.json({
							status: true,
							user: req.session.Auth,
							usermeta
						});
					}
				} else {
					res.json({ status: false, message: 'User not found' });
				}
			});
		}
	}
});
//API REGISTER ROUTE
router.post('/api/register', async (req, res) => {
	if (req.body.facebook) {
		let data = await User2.find({ email: req.body.email });
		if (data.length == 0) {
			const user = new User2({
				facebook: req.body.facebook,
				email: req.body.email,
				role: 'customer',
				username: req.body.username
			});
			await user.save().then(() => set(data));
			async function set(user) {
				let usermeta = new Usermeta2({ userid: user._id });
				await usermeta.save().then(() => res.json({ status: true, user }));
				var mailOptions = {
					from: '"CBD Bene" <admin@cbdbene.com>',
					to: req.body.email,
					subject: 'Successfully Registered - CBDBene',
					text: "You've been succesfully registered on CBDBene. "
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					if (err) {
					}
					console.log('Registration email sent ');
				});
			}
		} else {
			res.json({ status: false, message: 'User already exists' });
			return;
		}
	} else if (req.body.google) {
		let data = await User2.find({ email: req.body.email });
console.log({data});		
console.log({ aa: data.length });
		if (data.length === 0) {
			const user = new User2({
				google: req.body.google,
				email: req.body.email,
				role: 'customer',
				username: req.body.username
			});
			await user.save().then((data) => setmeta(data));

			async function setmeta(user) {
				let usermeta = new Usermeta2({ userid: user._id });
				await usermeta.save().then((data) => res.json({ status: true, user }));
				var mailOptions = {
					from: '"CBD Bene" <admin@cbdbene.com>',
					to: req.body.email,
					subject: 'Successfully Registered - CBDBene',
					text: "You've been succesfully registered on CBDBene. "
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					if (err) {
					}
					console.log('Registration email sent ');
				});
			}

		} else {
			res.json({ status: false, message: 'User already exists' });
			return;
		}
	} else {
		// validate the input
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('role', 'Role is required').notEmpty();
		req.checkBody('firstname', 'First Name is required').notEmpty();
		req.checkBody('lastname', 'Last Name is required').notEmpty();
		req.checkBody('phonenumber', 'Phone Number is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Password 2 is required').notEmpty();
		// check the validation object for errors
		let errors = req.validationErrors();

		if (errors) {
			res.json({ status: false, messages: errors });
		} else {
			// validate
			if (await User2.findOne({ email: req.body.email })) {
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

				console.log(req.body);
				const user = new User2({
					email: req.body.email,
					role: req.body.role,
					phonenumber: req.body.phonenumber,
					password: encrypted
				});

				// user.password = bcrypt.hashSync(userParam.password, 10);
				// save user
				await user.save().then((data) => setdata(data));

				async function setdata(user) {
					let usermeta = new Usermeta2({ userid: user._id, firstname: req.body.firstname,
						lastname: req.body.lastname });
					await usermeta.save().then((data) => res.json({ status: true, user }));
					

					var mailOptions = {
						from: '"CBD Bene" <admin@cbdbene.com>',
						to: req.body.email,
						subject: 'Successfully Registered - CBDBene',
						text: "You've been succesfully registered on CBDBene. "
					};
					
					smtpTransport.sendMail(mailOptions, function(err) {
						if (err) {
						}
						console.log('Registration email sent ');
					});
				}
			}
		}
	}
});

//Api ROUTE TO SAVE USER DETAILS
router.post('/api/profile', async function(req, res) {
	// validate the input
	// req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email does not appear to be valid').isEmail();
	// req.checkBody('password', 'Password is required').notEmpty();
	// // check the validation object for errors
	// let errors = req.validationErrors();
	// if (errors) {
	// 	res.json({ status: false, messages: errors });
	// } else {
	console.log(req.body);
	let id = req.body.userid;
	console.log({ id });

	await User2.findById(id).then(async function(user) {
		console.log(user);
		//Checking if user exists or not
		if (!(user == null)) {
			// User2.findOneAndUpdate({_id: id}, {$set: {"password": encrypted }});

			if (req.body.phonenumber) {
				await User2.findOneAndUpdate(
					{ _id: id },
					{ $set: { phonenumber: req.body.phonenumber } }
				);
			}

			let usermeta = {};
			if (req.body.password) {
				let password = req.body.password;
				let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
				var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
				// user.password = encrypted;1
				await User2.findOneAndUpdate({ _id: id }, { $set: { password: encrypted } });
			}
			if (req.body.firstname) {
				usermeta.firstname = req.body.firstname;
			}
			if (req.body.lastname) {
				usermeta.lastname = req.body.lastname;
			}

			if (req.body.billingdetails) {
				usermeta.billingdetails = req.body.billingdetails;
			}

			if(req.body.carddetails){
				usermeta.carddetails = req.body.carddetails;
			}

			if(req.body.expresscheckout){
				usermeta.expresscheckout = req.body.expresscheckout;
			}

			if(req.body.defaultaddress){
				usermeta.defaultaddress = req.body.defaultaddress;
			}

			if (req.body.shippingdetails) {
				usermeta.shippingdetails = req.body.shippingdetails;
			}
			if (req.body.zipcode) {
				usermeta.zipcode = req.body.zipcode;
			}
			if (req.body.region) {
				usermeta.region = req.body.region;
			}
			if (req.body.country) {
				usermeta.country = req.body.country;
			}
			if (req.body.state) {
				usermeta.state = req.body.state;
			}

			await Usermeta2.findOneAndUpdate({ userid: id }, usermeta, { new: true })
				.populate('userid')
				.then((data) => res.json({ status: true, user: data }))
				.catch((err) => res.json({ status: false, error: err }));
		}
	});
});

router.post('/api/profile/password', async function(req, res) {
	let password = req.body.oldpassword;
	let password2 = req.body.newpassword;
	let id = req.body.userid;
	await User2.findOne({ _id: id }).then((data) => set(data));
	async function set(data) {
		let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
		var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
		console.log(data);
		console.log(encrypted);
		if (data.password == encrypted) {
			let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
			var encrypted2 = cipher.update(password2, 'utf8', 'hex') + cipher.final('hex');
			await User2.findOneAndUpdate(
				{ _id: id },
				{ $set: { password: encrypted2 } },
				{ new: true }
			).then((data) => res.json({ status: true, user: data }));
		} else {
			res.json({ status: false, error: 'Incorrect Old Password' });
		}
	}
});

router.get('/api/profile/:id', async function(req, res) {
	let id = req.params.id;
	Usermeta2.findOne({ userid: id })
		.populate('userid')
		.then((data) => res.json({ status: true, user: data }));
});


router.get("/usermanagement/delete/:id", async (req, res) => {
console.log(req.params.id);
	let user = await Usermeta2.find({userid: req.params.id});
let userid = user[0]._id;
console.log({user});
console.log({userid})
let usermetaid = req.params.id;
console.log(userid);
console.log(usermetaid);
	User2.findByIdAndRemove({_id: usermetaid}, function(err, user){
            Usermeta2.findByIdAndDelete({_id: userid}, function(err, product){
            
                    if(err){
                        console.log(err);
					} 
					res.status(200).json({status: true})
				})})	
})

function ensureAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl;
		res.redirect('/users/login');
	}
}

//User management
router.get('/usermanagement', ensureAuthenticated, async function(req, res) {
	User2.find({}).then((data) => show(data));
	function show(data) {
		
		res.status(200).render('all_users.hbs', {
			pageTitle: 'All Users',
			user: data
		});
	}
});

router.post('/usermanagement', ensureAuthenticated, async (req, res) => {
	let firstName = req.body.firtstname;
	let lastName = req.body.lastname;
	let role = req.body.role;
	let status = req.body.status;
	let displayname = firstName + +lastName;

	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('phonenumber', 'phonenumber is required').notEmpty();
	req.checkBody('phonenumber', 'phonenumber is required').isNumeric();
	req.checkBody('password', 'Passwords is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
	if (errors)
		return res.status(404).render('all_users.hbs', {
			pageTitle: 'User Management',
			errors: errors,
			message: errors
		});

	let userexist = await User.findOne({ email: req.body.email }, '_id', function(err, user) {});
	if (userexist) {
		return res.status(404).render('all_users.hbs', {
			pageTitle: 'User Management',
			message: 'User already exist with this phone number'
		});
	} else {
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			displayname: displayname,
			phonenumber: req.body.phonenumber,
			role: role,
			password: req.body.password,
			status: status
		});
		let hashPass = bcrypt.hashSync(newUser.password, 11);
		newUser.password = hashPass;
		newUser.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(404).render('all_users.hbs', {
					pageTitle: 'User Management',
					message: 'Error in User Save',
					err: err
				});
			}
			User.findOne({ email: req.body.email }, '_id', function(err, user) {
				const userMeta = new UserMeta({
					firstname: user.firstname,
					lastname: user.lastName,
					userid: user._id
				});
				userMeta.save(function(err) {
					if (err) {
						console.log(err);
						return res.status(404).render('.hbs', {
							pageTitle: 'Sign up',
							message: 'Error in User meta Save',
							err: err
						});
					} else {
						console.log('User Created');
						return res.redirect('/users/usermanagement');
					}
				});
			});
		});
	}
});

// Register Proccess
router.post('/register', ensureNotAuthenticated, async (req, res) => {
	let firstName = req.body.firtstname;
	let lastName = req.body.lastname;
	let role = 'superadmin';
	let status = 'active';
	let displayname = firstName + +lastName;

	req.checkBody('username', 'User Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('phonenumber', 'phonenumber is required').notEmpty();
	req.checkBody('phonenumber', 'phonenumber is required').isNumeric();
	req.checkBody('password', 'Passwords is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
	if (errors)
		return res.status(404).render('register.hbs', {
			pageTitle: 'Sign up',
			errors: errors,
			message: 'validation error'
		});

	let userexist = await User.findOne({ email: req.body.email }, '_id', function(err, user) {});
	if (userexist) {
		return res.status(404).render('register.hbs', {
			pageTitle: 'Sign up',
			message: 'User already exist with this phone number'
		});
	} else {
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			displayname: displayname,
			phonenumber: req.body.phonenumber,
			role: role,
			password: req.body.password,
			status: status
		});
		let hashPass = bcrypt.hashSync(newUser.password, 11);
		newUser.password = hashPass;
		newUser.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(404).render('register.hbs', {
					pageTitle: 'Sign up',
					message: 'Error in User Save',
					err: err
				});
			}
			User.findOne({ email: req.body.email }, '_id', function(err, user) {
				const userMeta = new UserMeta({
					firstname: firstName,
					lastname: lastName,
					userid: user._id
				});
				userMeta.save(function(err) {
					if (err) {
						return res.status(404).render('register.hbs', {
							pageTitle: 'Sign up',
							message: 'Error in User meta Save',
							err: err
						});
					} else {
		var mailOptions = {
			from: '"CBD Bene" <admin@cbdbene.com>',
			to: req.body.email,
			subject: 'Registration Complete - CBDBene',
			text: "You have been successfully registered on CBDBene"
		};

		
		smtpTransport.sendMail(mailOptions, (error, response) => {
			// console.log(here);
			if (error) {
				console.log(error);
				return res.status(404).json({ success: false, message: error });
			} else {
				console.log(response);
				return res.status(200).json({ success: true, message: 'Email successfully sent' });
				smtpTransport.close();
			}
		});
						return res.status(200).render('register.hbs', {
							pageTitle: 'Sign up',
							message: 'User Successfully Register'
						});
					}
				});
			});
		});
	}
});

// Fetch Login Form
router.get('/login', ensureNotAuthenticated, function(req, res) {
	res.render('login.hbs', { pageTitle: 'Login', error: req.flash('error')[0] });
});

//Login Check For Adminpanel
router.post('/login', function(req, res, next) {
	req.checkBody('email', 'email is required').notEmpty();
	req.checkBody('password', 'Passwords is required').notEmpty();
	let errors = req.validationErrors();
	if (errors)
		return res
			.status(404)
			.res.render('login.hbs', { pageTitle: 'Login', error: req.flash('error')[0] });
	passport.authenticate('local', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Forget Password Page
router.get('/forgetpassword', ensureNotAuthenticated, function(req, res) {
	let message = req.query.pass;
	if (req.query.step) {
		res.render('forgetpassword.hbs', {
			pageTitle: 'Forget Password',
			userid: req.query.step
		});
	} else {
		res.render('forgetpassword.hbs', {
			pageTitle: 'Forget Password',
			message: message
		});
	}
});

//Forget password for APi
// forget Passwor Form Submit
router.post('/api/forgetpassword', async function(req, res, next) {
	if (req.body.firststep) {
		req.checkBody('email', 'email is required').notEmpty();
		let errors = req.validationErrors();
		if (errors) return res.status(404).json({ success: false, message: 'validation error' });

		let userExist = await User2.findOne({ email: req.body.email }, 'email', function(
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

			var url = process.env.serverurl + '/users/forgetpassword/?token=' + userExist._id;
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
			// console.log(here);
			if (error) {
				console.log(error);
				return res.status(404).json({ success: false, message: error });
			} else {
				console.log(response);
				return res.status(200).json({ success: true, message: 'Email successfully sent' });
				smtpTransport.close();
			}
		});
		//res.json({ status: true });
		// transporter.sendMail(mailOptions, function(error, info) {
		// 	if (error) {
		// 		console.log(error);
		// 		return res.status(404).json({ success: false, message: error });
		// 	} else {
		// 		return res
		// 			.status(200)
		// 			.json({ success: true, message: 'Email successfully sent' });
		// 	}
		// });
	} else {
		// req.checkbody('userid', "Userid is required").notEmpty();
		// req.checkBody('newpassword', 'Password is required').notEmpty();
		// let errors = req.validationErrors();
		// if (errors) return res.status(404).json({ success: false, message: 'validation error' });
		let userPassExist = await User2.findOne(
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
			User2.update(query, userobject, function(err) {
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

// forget Passwor Form Submit
router.post('/forgetpassword', async function(req, res, next) {
	if (req.body.firststep) {
		req.checkBody('emailid', 'email id is required').notEmpty();
		let errors = req.validationErrors();
		if (errors) return res.status(404).json({ success: false, message: 'validation error' });

		let userExist = await User.findOne(
			{ email: req.body.emailid, status: 'active' },
			'email',
			function(err, user) {}
		);
		if (!userExist) {
			return res.status(404).json({ success: false, message: 'No user found' });
		} else {
			// var transporter = nodemailer.createTransport({
			// 	service: 'gmail',
			// 	auth: {
			// 		user: 'ratnesh3rde@gmail.com',
			// 		pass: 'Roopesh_123'
			// 	}
			// });
			if (req.hostname == 'localhost') {
				var url =
					req.protocol +
					'://' +
					req.hostname +
					':3000/users/forgetpassword/?step=' +
					userExist._id;
			} else {
				var url = req.hostname + '/users/forgetpassword/?step=' + userExist._id;
			}
			var userEmail = userExist.email;
			var emailText = 'please click on the below link for the forget password link';
			emailText += '<p><a href="' + url + '">click here</a>';
			var mailOptions = {
				from: '"CBD Bene" <admin@cbdbene.com>',
				to: userEmail,
				subject: 'Forget Password Link',
				html: emailText
			};

			// transporter.sendMail(mailOptions, function(error, info) {
			// 	if (error) {
			// 		console.log(error);
			// 		return res.status(404).json({ success: false, message: error });
			// 	} else {
			// 		return res
			// 			.status(200)
			// 			.json({ success: true, message: 'email sent successfully' });
			// 	}
			// });
			smtpTransport.sendMail(mailOptions, (error, response) => {
				//console.log(here);
				if (error) {
					console.log(error);
					return res.status(404).json({ success: false, message: error });
				} else {
					console.log(response);
					return res
						.status(200)
						.json({ success: true, message: 'Email successfully sent' });
					smtpTransport.close();
				}
			});
			res.status(200).json({ success: true, message: 'email sent successfully' });
		}
	} else {
		req.checkBody('newpassword', 'Password is required').notEmpty();
		let errors = req.validationErrors();
		if (errors) return res.status(404).json({ success: false, message: 'validation error' });
		let userPassExist = await User.findOne(
			{ email: req.body.emailid, status: 'active' },
			'email',
			function(err, user) {}
		);
		if (!userPassExist) {
			return res.status(404).json({ success: false, message: 'No user found' });
		} else {
			let hashPass = bcrypt.hashSync(req.body.newpassword, 11);
			let userobject = {};
			userobject.password = hashPass;
			let query = { _id: req.body.userid };
			User.update(query, userobject, function(err) {
				if (err) {
					return res.status(404).json({ success: false, message: err });
				} else {
					return res
						.status(200)
						.json({ success: true, message: 'Successfully Change the password' });
				}
			});
		}
	}
});

// Login Process For application
router.post('/applogin', async function(req, res, next) {
	req.checkBody('email', 'email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Passwords is required').notEmpty();

	let errors = req.validationErrors();
	if (errors) return res.status(404).json({ success: false, message: 'validation error' });

	let userExist = await User.findOne({ email: req.body.email, status: 'active' }).select('-1');
	if (!userExist) {
		return res.status(404).json({ success: false, message: 'No user found' });
	} else {
		bcrypt.compare(req.body.password, userExist.password, function(err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				return res.status(200).json({
					success: true,
					name: userExist.name,
					email: userExist.email,
					phonenumber: userExist.phonenumber,
					_id: userExist._id,
					role: userExist.role,
					user: userExist
				});
			} else {
				return res.status(404).json({ success: false, message: 'Wrong password' });
			}
		});
	}
});

// Change Password Api for Application
router.post('/changepassword', async function(req, res, next) {
	req.checkBody('email', 'email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('newpassword', 'Password is required').notEmpty();
	if (req.body.flag == 1) {
		req.checkBody('oldpassword', 'Old Password is required').notEmpty();
	}
	let errors = req.validationErrors();
	if (errors) return res.status(404).json({ success: false, message: errors });

	let userExist = await User.findOne({ email: req.body.email, status: 'active' }).select('-1');

	if (!userExist) {
		return res.status(404).json({ success: false, message: 'No user found' });
	} else {
		if (req.body.flag == 1) {
			bcrypt.compare(req.body.oldpassword, user.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					let hashPass = bcrypt.hashSync(req.body.newpassword, 11);
					let userobject = {};
					userobject.password = hashPass;
					let query = { email: req.body.email };
					User.update(query, userobject, function(err) {
						if (err) {
							return res.status(404).json({ success: false, message: err });
						} else {
							return res.status(200).json({
								sucess: true,
								message: 'Successfully Change the password'
							});
						}
					});
				} else {
					return res
						.status(404)
						.json({ success: false, message: 'You have Entered Wrong password' });
				}
			});
		} else {
			let hashPass = bcrypt.hashSync(req.body.newpassword, 11);
			let userobject = {};
			userobject.password = hashPass;
			let query = { email: req.body.email };
			User.update(query, userobject, function(err) {
				if (err) {
					return res.status(404).json({ success: false, message: err });
				} else {
					return res
						.status(200)
						.json({ sucess: true, message: 'Successfully Change the password' });
				}
			});
		}
	}
});

router.post('/latestuserdetails', function(req, res) {
	if (req.body.userid) {
		User.findById(req.body.userid, function(err, user) {
			if (err) {
				res.json({ success: false, message: err });
			} else {
				res.json({ sucess: true, user: user });
			}
		});
	} else {
		res.json({ success: false, message: 'please provide the user id' });
	}
});

// logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/users/login');
});

function ensureNotAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl;
		res.redirect('/');
	}
}

module.exports = router;
