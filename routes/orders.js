require('dotenv').config();
const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
let db = require('../config/database');
const OrderProduct = require('../models/order_product');
const Order = db.order;
const orderMeta = require('../models/ordermeta');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Notify = require('../models/notification');
const { google } = require('googleapis');
const Referral = require('../models/referralvisits');
const OAuth2 = google.auth.OAuth2;
const EasyPost = require('@easypost/api');
const Invoice = require('nodeice');
//New Order Code
const OProduct = require('../models/orderedProduct');
const OOrder = require('../models/order');
const User2 = require('../models/user2');
const UserMeta2 = require('../models/usermeta2');
const Product = require('../models/product.js');
const Combos = require('../models/combos');
//Test key
//Dont forget to change this
const apiKey = 'EZTKabecb64c21dd48da9c2049dbce486899dlgd5K9QwNRQq4xhv01gJQ';

const api = new EasyPost(apiKey);

//Code that executes every day at midnight at 12
var schedule = require('node-schedule');

var j = schedule.scheduleJob('0 0 * * *', function() {
	OOrder.find().then((data) => mapThem(data)).catch(console.log);

	function mapThem(data) {
		console.log(data);
		if (data.length > 0) {
			data.map((order) => {
				if (order.trackerId && order.status !== 'delivered') {
					let trackerid = order.trackerId;
					api.Tracker.retrieve(trackerid).then((s) => updateThem(s)).catch(console.log);
					function updateThem(status) {
						let currentStatus = status.status;
						OOrder.findByIdAndUpdate(order._id, { $set: { status: currentStatus } })
							.then((data) => sendMail(data))
							.catch((err) => res.json({ status: false, err }));

						function sendMail(data) {
					// 		let html = `<td class="m_-4653644642374936975emailBodyTD" style="padding-left:17px;padding-right:18px;padding-top:23px;padding-bottom:21px;border-collapse:collapse!important;font-family:Arial,sans-serif"> <a href="https://www.amazon.in/gp/r.html?C=14SOZNJJ1FEWX&amp;K=17VW82JD58AQY&amp;M=urn:rtn:msg:201908110756409e02d17a07574115ad9ad6907780p0eu&amp;R=3SYGIVB6H0E8S&amp;T=C&amp;U=https%3A%2F%2Fwww.amazon.in%3Fref_%3Dpe_3025041_270609711&amp;H=Q7CUB8ZMKBFMP2JK79ICWO45APGA&amp;ref_=pe_3025041_270609711" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.amazon.in/gp/r.html?C%3D14SOZNJJ1FEWX%26K%3D17VW82JD58AQY%26M%3Durn:rtn:msg:201908110756409e02d17a07574115ad9ad6907780p0eu%26R%3D3SYGIVB6H0E8S%26T%3DC%26U%3Dhttps%253A%252F%252Fwww.amazon.in%253Fref_%253Dpe_3025041_270609711%26H%3DQ7CUB8ZMKBFMP2JK79ICWO45APGA%26ref_%3Dpe_3025041_270609711&amp;source=gmail&amp;ust=1566546825510000&amp;usg=AFQjCNH1C8PwotmnOV5LJGJkzfK6bVAkzQ"> 
					// 	<table class="m_-4653644642374936975brandTable" style="margin-bottom:20px;width:100%;min-width:338px;border-collapse:collapse!important;text-align:left"> 
					// 	 <tbody>
					// 	  <tr> 
					// 	   <td align="center" style="border-collapse:collapse!important;font-family:Arial,sans-serif"> 
					// 		 <img src="https://cbdbene.com/static/media/bene_new.ce8b3135.png" alt="www.cbdbene.com" title="www.cbdbene.com" class="m_-4653644642374936975brandImage CToWUd" border="0" width="130" style="width:130px"> 
					// 		 </td> 
					// 	  </tr> 
					// 	 </tbody>
					// 	</table> </a> 
					//    <table class="m_-4653644642374936975emailContainer" style="background-color:rgb(255,255,255);border-left:1px solid rgb(214,214,214);border-right:1px solid rgb(214,214,214);border-bottom:1px solid rgb(214,214,214);border-top:2px solid rgb(206,206,206);border-collapse:collapse!important;text-align:left"> 
					// 	<tbody>
					// 	 <tr> 
					// 	  <td class="m_-4653644642374936975emailContainerTD" style="padding-left:23px;padding-right:23px;padding-top:25px;padding-bottom:33px;border-collapse:collapse!important;font-family:Arial,sans-serif"> 
					// 	   <table class="m_-4653644642374936975greetingTable" style="font-size:20px;line-height:24px;color:rgb(0,46,54);margin-bottom:18px;border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td style="border-collapse:collapse!important;font-family:Arial,sans-serif"><span>Hi ${data.userDetails
					// 				.firstname},</span> </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> 
							
							
					// 	   <table class="m_-4653644642374936975informationTable" style="font-size:18px;line-height:24px;color:rgb(0,46,54);border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td style="padding-bottom:18px;border-collapse:collapse!important;font-family:Arial,sans-serif"><span>Your package has been delivered!</span> </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> 
							
							
							
					// 	   <table class="m_-4653644642374936975informationTableReducedPadding" style="font-size:18px;line-height:24px;color:rgb(0,46,54);border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td style="padding-bottom:2px;border-collapse:collapse!important;font-family:Arial,sans-serif"><span>We'd Love your Feedback</span> </td> 
							  
					// 		</tr> 
							
					// 		</tbody>
							
					// 	   </table> 
					// 	   <span>Like many our customers, you may have found customer reviews of out products useful in making your choices. We invite you to add your voice to the mix.<br>
					// 	</span> 
						  
							
							
					   
							
						  
							
					// 		<br>
					// 	   <table class="m_-4653644642374936975instructionTable" style="font-size:15px;line-height:18px;color:rgb(135,149,150);border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr>
					// 			  <td></td>
					// 		  <td style="padding-bottom:18px;border-collapse:collapse!important;font-family:Arial,sans-serif"><span>Go to <a class="m_-4653644642374936975textWithUnderlinedLink" style="color:rgb(134,134,134);text-decoration:none;border-bottom:2px solid rgb(0,223,252)" href="https://cbdbene.com/my-account">Your Orders</a> to post a review. </span> </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> 
							
					// 	   <table class="m_-4653644642374936975separatorLine" border="0" width="100%" cellpadding="0" cellspacing="0" style="border-left:0;border-right:0;border-top:0;border-bottom:0;border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td class="m_-4653644642374936975separatorLeft" style="width:5px;font-size:1px;border-collapse:collapse!important;font-family:Arial,sans-serif"> &nbsp; </td> 
					// 		  <td class="m_-4653644642374936975separatorMiddle" style="width:284px;min-width:284px;background:none;border-top:0px;border-right:0px;border-left:0px;border-bottom:1px solid rgb(135,149,150);height:1px;margin:0px 0px 0px 0px;font-size:1px;border-collapse:collapse!important;font-family:Arial,sans-serif"> &nbsp; </td> 
					// 		  <td class="m_-4653644642374936975separatorRight" style="width:5px;font-size:1px;border-collapse:collapse!important;font-family:Arial,sans-serif"> &nbsp; </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> 
					// 	   <div class="m_-4653644642374936975separatorLineBelow" style="font-size:18px">
					// 		&nbsp;
					// 	   </div> 
					// 	   <table class="m_-4653644642374936975emailClosing_orderInstruction" style="border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td style="border-collapse:collapse!important;font-family:Arial,sans-serif"><span class="m_-4653644642374936975emailClosing" style="font-size:9px;line-height:15px;color:rgb(134,134,134)">Order # <a class="m_-4653644642374936975emailClosing m_-4653644642374936975inline-block" style="text-decoration:none;font-size:9px;line-height:15px;color:rgb(134,134,134);display:inline-block" href="https://cbdbene.com/my-account">${data.transactionId}</a>.</span> </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> 
					// 	   <table class="m_-4653644642374936975emailClosing" style="font-size:9px;line-height:15px;color:rgb(134,134,134);border-collapse:collapse!important;text-align:left"> 
					// 		<tbody>
					// 		 <tr> 
					// 		  <td style="border-collapse:collapse!important;font-family:Arial,sans-serif"><span class="m_-4653644642374936975emailClosing" style="font-size:9px;line-height:15px;color:rgb(134,134,134)">Please don't reply to this email.</span> </td> 
					// 		 </tr> 
					// 		</tbody>
					// 	   </table> </td> 
					// 	 </tr> 
					// 	</tbody>
					//    </table> </td>`;
					let html = `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<meta http-equiv="X-UA-Compatible" content="ie=edge">
						<title>Document</title>
						<link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
					</head>
					<body>
						
						<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
							<tbody><tr>
								<td align="center">
									<!-- START HEADER/BANNER -->
									<table class="col-600" width="600" >
										<tbody><tr>
											<td align="center" valign="top" background="https://admin.cbdbene.com/public/images/1180.png" bgcolor="#66809b" style="position:relative;background-size:cover; background-position:top;height:400;">
											<div class="overlay" style="background: linear-gradient(to right, #29261b 0%, #2a271c 28%, rgba(44, 41, 30, 0.59) 59%, rgba(48, 45, 35, 0.58) 100%);
												width: 100%;height: 100%;position: absolute;top: 0;left: 0;right: 0;bottom: 0; z-index: 0;cursor: pointer;"></div>
												<table class="col-600" width="600" height="400" style="padding: 30px;">
												<tbody><tr>
													<td height="40"></td>
												</tr>
												<tr>
													<td style="line-height: 0px; border-left: 1px solid #d6ab67;z-index: 1;position: relative;">
														<img style="padding-left:20px; display:block; line-height:0px; font-size:0px; border:0px;z-index: 1;position: relative;" src="https://admin.cbdbene.com/public/images/logo.png" width="100" height="119" alt="logo">
														<p style="padding-left:20px; font-family: 'Montserrat', sans-serif; font-size:3.1em; color:#cfa564;z-index: 1;position: relative; line-height:24px; font-weight: 100;">Hello ${data.userDetails.firstname}</p>
														<p style="padding-left:20px;font-family: 'Montserrat', sans-serif;font-size: 14px; color:#cfa564;z-index: 1;position: relative; line-height:24px;"> Your package has been delivered!</p>
													</td>
													
												</tr>
												<tr>
													<td height="50"></td>
												</tr>
											<tbody></table>
											</td>
										</tr>
									</tbody></table>
								</td>
							</tr>
							<!-- START PRICING TABLE -->
					
							<tr>
								<td align="center">
									<table width="600" class="col-600" align="center" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f5;">
										<tbody><tr>
											<td height="50"></td>
										</tr>
										<tr>
											<td align="center" style="font-size:20px;padding:15px 30px;font-family: 'Montserrat', sans-serif;padding-left: 30px;">We'd Love your Feedback</td>
										</tr>
										<tr>
											<td align="center" style="font-size:15px;padding:15px 30px; color:#000000a8;font-family: 'Montserrat', sans-serif;padding-left: 30px;">Like many our customers, you may have found customer reviews of out products useful in making your choices. We invite you to add your voice to the mix.</td>
										</tr>
										<tr>
											<td align="center" style="font-size:20px;padding:15px 30px;font-family: 'Montserrat', sans-serif;padding-left: 30px;">Go to <a style="color:#cfa564;text-decoration:none;" href="https://cbdbene.com/account">Your Orders</a> to post a review.</td>
										</tr>  
												</tbody></table>
					
											</td>
										</tr>
									</tbody></table>
								</td>
							</tr>
					
					
					<!-- END PRICING TABLE --> 
					
					<!-- show dispatched -->
					<tr>
						<td align="center">
							<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" background-color: #faf7f5;">
								<tbody><tr>
									<td height="50"></td>
								</tr>
								<tr>
					
					
									<td align="center" bgcolor="#faf7f5">
										<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
											<tbody><tr>
												<td height="35"></td>
											</tr>
					
					
											<tr>
												<td align="center" style="width:33.3%">
													<div class="order-show" style="width:24px; position:relative;">
														<img style="width:100%;" src="https://admin.cbdbene.com/public/images/3.png">
														<span style="height: 2px;background-color: #00000024;position: absolute;width: 150px;top: 0;bottom: 0;left: 32px;margin: auto;"></span>
													</div>
												</td>
												<td align="center" style="width:33.3%">
													<div class="order-show" style="width:34px;position:relative;">
														<img style="width:100%;" src="https://admin.cbdbene.com/public/images/Tracking.png">
														<span style="height: 2px;background-color: #00000024;position: absolute;width: 150px;top: 0;bottom: 0;left: 52px;margin: auto;"></span>
													</div>
												</td>
												<td align="center" style="width:33.3%">
													<div class="order-show" style="width:24px;">
														<img style="width:100%;" src="https://admin.cbdbene.com/public/images/5.png">
													</div>
												</td>
											</tr>
											<tr>
												<td align="center" style="width:33.3%">
													<div class="order-show" style="font-size: 10px;font-family: 'Montserrat', sans-serif;">
														<span>Order Palced</span>
													</div>
												</td>
												<td align="center" style="width:33.3%">
													<div class="order-show" style="font-size: 10px;font-family: 'Montserrat', sans-serif;">
														<span>Order Dispatched</span>
													</div>
												</td>
												<td align="center"style="width:33.3%">
													<div class="order-show" style="font-size: 10px;font-family: 'Montserrat', sans-serif;">
														<span>Delivered Succefully</span>
													</div>
												</td>
											</tr>
					
					
											<tr>
												<td height="40"></td>
											</tr>
					
										</tbody></table>
									</td>
								</tr>
							</tbody></table>
						</td>
					</tr>
					<!-- end show -->
						</tbody></table>
					
					
					</body>
					</html>`
							var mailOptions = {
								from: '"CBD Bene" <admin@cbdbene.com>',
								to: data.userDetails.email,
								subject: 'Delivered: Your Bene package has been delivered.',
								html
								// text: "Your order has been successfully placed. You can track your order with the link given below." +
								// "\n\n"  + trackingUrl,
							};

							smtpTransport.sendMail(mailOptions, function(err) {
								if (err) {
									console.log(err);
								}
							});
						}
					}
				} else {
					console.log('no orders to update');
				}
			});
		}
	}
});

router.get('/testcase', (req, res) => {
	let tasks = [];
	let products = [
		{
			qty: 1,
			unitPrice: '24.99',
			title: 'CBD Chocolate'
		},
		{
			qty: 1,
			unitPrice: '241.99',
			title: 'CBD Chocolate1'
		},
		{
			qty: 1,
			unitPrice: '242.99',
			title: 'CBD Chocolate2'
		},
		{
			qty: 1,
			unitPrice: '243.99',
			title: 'CBD Chocolate3'
		}
	];

	products.map((el) => {
		invItem = {};
		invItem.qty = el.qty;
		invItem.unitPrice = el.unitPrice;
		invItem.title = el.title;
		tasks.push(invItem);
	});
	console.log(tasks);
});

// Test route to test then above code manually
router.get('/testcron', (req, res) => {
	OOrder.find().then((data) => mapThem(data)).catch(console.log);

	function mapThem(data) {
		console.log(data);
		if (data.length > 0) {
			data.map((order) => {
				if (order.trackerId && order.status !== 'delivered') {
					let trackerid = order.trackerId;
					api.Tracker.retrieve(trackerid).then((s) => updateThem(s)).catch(console.log);
					function updateThem(status) {
						let currentStatus = status.status;
						OOrder.findByIdAndUpdate(order._id, { $set: { status: currentStatus } })
							.then((data) => console.log({ status: true, data }))
							.catch((err) => res.json({ status: false, err }));
					}
				} else {
					console.log('no orders to update');
				}
			});
		}
	}
});

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
// let Delivery = require('../models/delivery');
// let User = require('../models/user');
// let Notification = require('../models/notification');


let smtpTransport = nodemailer.createTransport({
	host:"email-smtp.ap-south-1.amazonaws.com",
	port: 25,
	secure: false,
	tls: {
		rejectUnauthorized: false
	},
	auth: {
		user: process.env.smtpUsername,
		pass: process.env.smtpPassword
	  }
});

//Route to fetch the order as per the userid
router.get('/get', (req, res) => {
	let id = req.params.id;
	OOrder.findById(id)
		.then((data) => res.json({ status: true, data }))
		.catch((error) => res.json({ status: false, error }));
});

//deeleting the order from frontend
router.post('/api/delete', async function(req, res) {
	let id = req.body.id;
	OrderProduct.findOneAndUpdate({ _id: id }, { $set: { deleted: 'Cancelled By User' } }, { new: true })
		.then((data) => res.json({ status: true, order: data }))
		.catch((err) => ({ status: false, error: err }));
});

//List all the orders placed by any particular user
router.get('/api/getbyuser/:id', function(req, res) {
	let query = req.params.id;
	OOrder.find({ userMetaId: query })
		.populate({path:'products',populate:{
			path:'productId'
		}})
		.then((data) => res.json({ status: true, orders: data }))
		.catch((err) => res.json({ status: false, error: err }));
	// 		if (err) {
	// 			res.json({ success: false, message: err });
	// 		} else {
	// 			console.log(orders)
	// 			res.json({ success: true, orders: orders });
	// 		}
	// 	}).sort({ orderdate: 'desc' });
	// } else {
	// 	res.json({ success: false, message: 'User Id is empty' });
	// }
});

//Set review
router.get('/review/:id', (req, res) => {
	let id = req.params.id;
	OProduct.findByIdAndUpdate(id, { $set: { reviewed: true } }, { new: true })
		.then((data) => res.json({ status: true, data }))
		.catch((error) => res.status(400).json({ status: false, error }));
});

var fs = require('fs');
router.post('/process/order', async function(req, res) {
	console.log(req.body);
	const length = req.body.products.length;
	if (req.body.products) {
		let Products = [];
		let tasks = [];

		req.body.products.map(async (el) => {
			console.log({ el });
			let orderedProduct = new OProduct();
			if (el.isCombo) {
				orderedProduct.isCombo = el.isCombo;
				orderedProduct.comboId = el.comboId;
			} else {
				orderedProduct.productId = el.productId;
				orderedProduct.productMeta = el.productMeta;
			}
			orderedProduct.isSubscribed = el.isSubscribed;
			if (el.isSubscribed) {
				orderedProduct.subscriptionId = el.subscriptionId;
				orderedProduct.subscriptionMeta = el.subscriptionMeta;
				orderedProduct.subscriptionFailed = el.subscriptionFailed;
			}
			orderedProduct.qty = el.qty;
			orderedProduct.unitPrice = el.unitPrice;
			orderedProduct.subTotal = el.subTotal;
			orderedProduct.attribute = el.attribute;
			orderedProduct.title = el.title;
			let invItem = {};
			if (el.isSubscribed) {
				invItem.description = el.title + ' ' + '(Subscribed Product)';
			} else {
				invItem.description = el.title;
			}
			invItem.quantity = el.qty;
			invItem.unitPrice = Math.floor(el.unitPrice);
			invItem.unit = 'Hours';
			tasks.push(invItem);
			console.log({ orderedProduct });
			orderedProduct.save().then((data) => addToArray(data)).catch(console.log);
		});

		function addToArray(data) {
			Products.push(data._id);
			console.log({ 'inside function': Products });
		}

		setTimeout(function() {
			let order = new OOrder();
			(order.products = Products), (order.carrier = req.body.carrier);
			order.country = req.body.country;
			let itemMeta2 = {};
			if (req.body.taxAmount > 0) {
				itemMeta2.description = 'Tax';
				itemMeta2.quantity = 1;
				itemMeta2.unitPrice = Math.floor(req.body.taxAmount);
				itemMeta2.unit = 'Hours';
				tasks.push(itemMeta2);
			}

			(order.countryTax = req.body.countryTax),
				(order.couponDisc = req.body.couponDisc),
				(order.isCoupon = req.body.isCoupon),
				(order.couponId = req.body.couponId),
				(order.fees = req.body.fees),
				(order.grandTotal = req.body.grandTotal),
				(order.label = req.body.label),
				(order.orderStatus = req.body.orderStatus),
				(order.paymentMethod = req.body.paymentMethod),
				(order.paymentStatus = req.body.paymentStatus),
				(order.originalRate = req.body.originalRate),
				(order.rateId = req.body.rateid),
				(order.rate = req.body.rate),
				(order.shipmentId = req.body.shipmentid);
			let itemMeta = {};
			if (req.body.shippingCharge > 0) {
				itemMeta.description = 'Shipping Charge';
				itemMeta.quantity = 1;
				itemMeta.unitPrice = Math.floor(req.body.shippingCharge);
				itemMeta.unit = 'Hours';
				tasks.push(itemMeta);
			}
			(order.shippingCharge = req.body.shippingCharge),
				(order.shippingMethod = req.body.shippingMethod),
				(order.status = req.body.status),
				(order.taxAmount = req.body.taxAmount),
				(order.totalVolume = req.body.totalVolume),
				(order.totalWeight = req.body.totalWeight),
				(order.totalHeight = req.body.totalHeight),
				(order.totalLength = req.body.totalLenth),
				(order.totalWidth = req.body.totalWidth),
				(order.trackerId = req.body.trackerid),
				(order.trackingCode = req.body.trackingCode),
				(order.transactionId = req.body.transactionId),
				(order.userDetails = req.body.userDetails),
				(order.userId = req.body.userId),
				(order.userMetaId = req.body.userMetaId),
				(order.wholeSubtotal = req.body.wholeSubtotal),
				(order.isGuest = req.body.isGuest),
				(order.wasReferred = req.body.wasReferred),
				(order.referral = req.body.referral),
				(order.refPercentage = req.body.refPercentage);
			order.save().then((data) => addToUser(data)).catch(console.log);

			function addToUser(data) {
				OOrder.findById(data._id).populate('products').then((data) => processo(data));

				function processo(data) {
					if (req.body.wasReferred) {
						let id = req.body.referral;
						let subTotal = req.body.wholeSubtotal;
						let percentage = req.body.refPercentage;
						let refAmount = subTotal / 100 * percentage;
						Referral.findByIdAndUpdate(id, {
							$set: { converted: true, amount: refAmount, orderid: data._id }
						})
							.then(console.log('Referral saved'))
							.catch(console.log);
					}

					let trackerid;
					if (req.body.carrier !== 'shipment_failed') {
						trackerid = req.body.trackerid;
					} else {
						trackerid = 'Not found';
					}
					if (req.body.carrier !== 'shipment_failed') {
						api.Tracker.retrieve(trackerid).then((s) => sendTrackingId(s)).catch(console.log);
					} else {
						let dummy = {
							public_url: 'Not Found'
						};
						sendTrackingId(dummy);
					}
					function sendTrackingId(userdata) {
						let trackingUrl = userdata.public_url;
						transactionid = data.transactionId;

						let name = data.userDetails.firstname;
						let orderdate = data.createdOn;
						let products = [];
						let mapper = data.products.map(async (el) => {
							let producturl;
							let prod;
							let name;

							if (el.comboId) {
								prod = await Combos.findById(el.comboId);
								name = prod.title;
								let urlpost = name.replace(/\s+/g, '-').toLowerCase();
								producturl = 'https://cbdbene.com/shop/' + urlpost;
							} else {
								prod = await Product.findById(el.productId);
								name = prod.producttitle;
								let urlpost = name.replace(/\s+/g, '-').toLowerCase();
								producturl = 'https://cbdbene.com/shop/' + urlpost;
								console.log('---------------------------------------------------------');
								console.log({ prod });
							}

							let prodimg = 'https://admin.cbdbene.com/var/www/cbdbene_3rde/cbdbene/' + prod.menuimage;

							console.log({ prodimg });

							let htmldata = ` <tr>
              <td style="width:150px;vertical-align:top;border-bottom: 1px solid #0000003b;"><img style="width:100%" src="${prodimg}"></td>
              <td style="width:240px;padding:0px;vertical-align:top;padding: 20px 0;border-bottom: 1px solid #0000003b;">
                  <p style="font-family: 'Montserrat', sans-serif;margin:0 0 10px 0;padding:0;font-size:11px;"><span style="display:block;font-weight:bold;font-size:11px">${name} ( x${el.qty} )</span>Quantity: ${el.qty} </p>
              </td>
              <td style="width:70px;padding:0px;vertical-align:top;padding: 20px 0;border-bottom: 1px solid #0000003b;">${Math.floor(
					el.subTotal
				)} $</td>
          </tr>`;

							// 									let htmldata = `<tr>
							// <td class="m_-1220850270213470107m_3747154870368339796photo"
							//   style="width:150px;text-align:center;padding:16px 0 10px 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							//   <a href="${producturl}"
							// 	style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
							// 	target="_blank"
							// 	data-saferedirecturl="${producturl}">
							// 	<img style="width: 250px; height: 250px;" id="m_-1220850270213470107m_3747154870368339796asin"
							// 	  src="${prodimg}"
							// 	  style="border:0" class="CToWUd"> </a> </td>
							// <td class="m_-1220850270213470107m_3747154870368339796name"
							//   style="color:rgb(102,102,102);padding:10px 0 0 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							//   <a href="${producturl}"
							// 	style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
							// 	target="_blank"
							// 	data-saferedirecturl="${producturl}">
							// 	${name}</a> <br> Quantity: x${el.qty}

							//   <div>
							// 	<table border="0" cellspacing="4" cellpadding="0" style="border-collapse:separate">
							// 	  <tbody style="vertical-align:bottom">
							// 		<tr>
							// 		  <td
							// 			style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							// 		  </td>
							// 		  <td
							// 			style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							// 			<a href=""
							// 			  title="Share on Facebook"
							// 			  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
							// 			  target="_blank"
							// 			  data-saferedirecturl="">
							// 			  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-facebook"
							// 				style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
							// 			  </i> </a> </td>
							// 		  <td
							// 			style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							// 			<a href=""
							// 			  title="Share on Twitter"
							// 			  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
							// 			  target="_blank"
							// 			  data-saferedirecturl="">
							// 			  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-twitter"
							// 				style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
							// 			  </i> </a> </td>
							// 		  <td
							// 			style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							// 			<a href=""
							// 			  title="Pin it on Pinterest"
							// 			  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
							// 			  target="_blank"
							// 			  data-saferedirecturl="">
							// 			  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-pinterest"
							// 				style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
							// 			  </i> </a> </td>
							// 		</tr>
							// 	  </tbody>
							// 	</table>
							//   </div>
							// </td>
							// <td class="m_-1220850270213470107m_3747154870368339796price"
							//   style="text-align:right;font-size:14px;padding:10px 10px 0 10px;white-space:nowrap;vertical-align:top;line-height:16px;font-family:Arial,sans-serif">
							//   <strong>$ ${Math.floor(el.subTotal)}</strong> <br> </td>
							// </tr>`
							// console.log({ htmldata })
							products.push(htmldata);
						});

						setTimeout(function() {
							let shippingchrg = Math.round(data.shippingCharge);
							let taxamnt = Math.round(data.taxAmount);

							let html = `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta http-equiv="X-UA-Compatible" content="ie=edge">
                  <title>Document</title>
                  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
              </head>
              <body>
                  <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td align="center">
                              <!-- START HEADER/BANNER -->
                          <table class="col-600" width="600">
                            <tbody>
                              <tr>
                                <td align="center" valign="top" background="https://admin.cbdbene.com/public/images/bnr-img.png" bgcolor="#66809b" style="position:relative;background-size:cover; background-position:top;height:400;">
                                  <div class="overlay" style="background: linear-gradient(to right, #29261b 0%, #2a271c 28%, rgba(44, 41, 30, 0.59) 59%, rgba(48, 45, 35, 0.58) 100%);
                                        width: 100%;height: 100%;position: absolute;top: 0;left: 0;right: 0;bottom: 0; z-index: 0;cursor: pointer;"></div>
                                  <table class="col-600" width="600" height="400" style="padding: 30px;">
                                    <tbody>
                                      <tr>
                                        <td height="40"></td>
                                      </tr>
                                      <tr>
                                        <td style="line-height: 0px; border-left: 1px solid #d6ab67;z-index: 1;position: relative;">
                                            <img style="padding-left:20px; display:block; line-height:0px; font-size:0px; border:0px;z-index: 1;position: relative;" src="https://admin.cbdbene.com/public/images/logo.png" width="100" height="119" alt="logo">
                                            <p style="padding-left:20px; font-family: 'Montserrat', sans-serif; font-size:3.1em; color:#cfa564;z-index: 1;position: relative; line-height:24px; font-weight: 100;">Hello ${name}</p>
                                            <p style="padding-left:20px;font-family: 'Montserrat', sans-serif;font-size: 14px; color:#cfa564;z-index: 1;position: relative; line-height:24px;"> Thank you for your order, we hope  you <br/> enjoyed shopping with us.</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td height="50"></td>
                                      </tr>
                                    <tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <!-- START PRICING TABLE -->
                      <tr>
                        <td align="center">
                          <table width="600" class="col-600" align="center" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf7f5; border-right: 1px solid #dbd9d9;">
                            <tbody>
                              <tr>
                                <td height="50"></td>
                              </tr>
                              <tr>
                                <td style="font-size:20px;padding:30px 15px 0 15px;font-family: 'Montserrat', sans-serif;padding-left: 30px;">YOUR ORDER</td>
                              </tr>
                              <tr>
                                <td height="30"></td>
                              </tr>
                              <tr>
                                <td style="vertical-align: top;">
                                  <table class="col2" width="247" border="0" align="left" cellpadding="0" cellspacing="0">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table class="insider" width="257" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left: 15px;">
                                            <tbody>
                                                            ${products}
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td  style="vertical-align: baseline;padding-left: 15px;border-left:1px solid #cfa564;">
                                  <div class="addinfo">
                                    <table>
                                      <tbody>
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;">Shipping Address:</td>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;text-align: right;"><a
                                            href="${trackingUrl}" Order No: ${transactionid}</a></td>
                                        </tr>
                                        <tr>
                                            <td style="color: #828282;font-size: 13px;padding-bottom: 15px;font-family: 'Montserrat', sans-serif;">Lorem ipsum<br/>
                                                102, lorem ipsum<br/>
                                                United States</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;">Tax</td>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;text-align: right;">${taxamnt}$</td>
                                        </tr>
                                        <tr>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;">Delivery</td>
                                            <td style="font-family: 'Montserrat', sans-serif;font-size: 13px;text-align: right;">${shippingchrg}$</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top: 20px; font-weight: bold;font-family: 'Montserrat', sans-serif;font-size: 13px;">Total</td>
                                            <td style="padding-top: 20px; font-weight: bold;font-family: 'Montserrat', sans-serif;font-size: 13px;text-align: right;">${data.grandTotal}$</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td height="30"></td>
                              </tr>                              
                            </tbody>
                          </table>
                        </td>
                      </tr>
              
              <!-- END PRICING TABLE --> 
              
              <!-- show dispatched -->
                      <tr>
                        <td align="center">
                          <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" background-color: #faf7f5; border-right: 1px solid #dbd9d9;">
                            <tbody>
                              <tr>
                                <td height="50"></td>
                              </tr>
                              <tr>
                                <td align="center" bgcolor="#faf7f5">
                                  <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                      <tr>
                                        <td height="35"></td>
                                      </tr>
                                      <tr>
                                        <td><img style="width:100%;" src="https://admin.cbdbene.com/public/images/ftr-img.png"></td>
                                      </tr>
                                      <tr>
                                          <td height="40"></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
              <!-- end show -->
                  </tbody></table>              
              </body>
              </html>`;

							console.log(html);
							console.log({ products });
							var mailOptions = {
								from: '"CBD Bene" <admin@cbdbene.com>',
								to: req.body.userDetails.email,
								subject: 'Order Placed - CBDBene',
								html,
								// text: "Your order has been successfully placed. You can track your order with the link given below." +
								// "\n\n"  + trackingUrl,
								attachments: [
									{
										filename: 'invoice.pdf',
										path: path
									}
								]
							};

							smtpTransport.sendMail(mailOptions, function(err) {
								if (err) {
									console.log(err);
								}
							});
						}, 1500);

						let myInvoice = new Invoice({
							config: {
								template: __dirname + '/template/index.html',
								tableRowBlock: __dirname + '/template/blocks/row.html'
							},
							data: {
								currencyBalance: {
									main: 1,
									secondary: 3.67
								},
								invoice: {
									number: {
										series: 'Bene',
										separator: '-',
										id: transactionid
									},
									date: data.createdOn,
									explanation: 'Thank you for being a Customer',
									currency: {
										main: '$'
										//   , secondary: "ZZZ"
									}
								},
								tasks
							},
							seller: {
								company: 'Bene LLC'
								//   , registrationNumber: "F05/XX/YYYY"
								//   , taxId: "00000000"
								//   , address: {
								// 		street: "The Street Name"
								// 	  , number: "00"
								// 	  , zip: "000000"
								// 	  , city: "Some City"
								// 	  , region: "Some Region"
								// 	  , country: "Nowhere"
								// 	}
								//   , phone: "+40 726 xxx xxx"
								//   , email: "support@cbdbene.com"
								//   , website: "cbdbene.com"
								//   , bank: {
								// 		name: "Some Bank Name"
								// 	  , swift: "XXXXXX"
								// 	  , currency: "XXX"
								// 	  , iban: "..."
								// 	}
							},
							buyer: {
								company: data.userDetails.firstname + ' ' + data.userDetails.lastname,

								address: {
									street: data.userDetails.billingaddress,
									zip: data.userDetails.zipcode,
									city: data.userDetails.state,
									country: data.userDetails.country
								},
								phone: data.userDetails.phonenumber,
								email: data.userDetails.email
							}
						});

						let filehtml = '/' + data._id + '.html';

						let filepdf = '/' + data._id + '.pdf';
						
						
						// Render invoice as HTML and PDF

						myInvoice
							.toHtml('./public/images' + filehtml, (err, data) => {
								if(err) console.log('invoice tohtml',err);
								
								console.log(data);
								console.log('Saved HTML file');
							})
							.toPdf('./public/images' + filepdf, (err, data) => {
								if(err){
									console.log('invoice to pdf',err);	
								}
								console.log('Saved pdf file');
							});
						let path = './public/images/' + data._id + '.pdf';
						let pathName = data._id + '.pdf';
						setTimeout(function() {
							console.log({ 'Order placed email sent': trackingUrl });
						}, 3000);
						let notify = new Notify();
						(notify.title = 'New Order'),
							(notify.content = 'New Order Placed'),
							(notify.type = 'order'),
							(notify.vieworder = data._id);
						notify.save().then((data) => console.log(data));
						let referralid = req.body.referral;
						let orderidin = data._id;
						let ref_total = req.body.wholesubtotal;
						if (req.body.wasReffered) {
							Referral.findByIdAndUpdate(
								referralid,
								{ $set: { converted: true, orderid: orderidin, amount: ref_total } },
								{ new: true }
							)
								.then((data) => console.log({ status: true, data }))
								.catch((err) => console.log({ status: false, error: err }));
						}

						res.status(200).json({ status: true, data });
						if (req.body.userMetaId) {
							UserMeta2.findByIdAndUpdate(
								req.body.userMetaId,
								{ $push: { orders: data._id } },
								{ new: true }
							)
								.then((data) => console.log(data))
								.catch(console.log);
						}

						console.log({ tasks });
						// Create the new invoice
						// Create the new invoice
					}
				}
			}
		}, 3000);
	}
});

//Add to cart
router.post('/add/cart', (req, res) => {
	if (req.body.usermetaid) {
		UserMeta2.findByIdAndUpdate(req.body.usermetaid, { $set: { cart: req.body.cart } }, { new: true })
			.then((data) => res.json({ status: true, data }))
			.catch((error) => res.json({ status: false, error }));
	} else {
		res.status(400).json({ status: false, error: 'usermetaid missing' });
	}
});

// Adding orde to database
router.post('/add', async function(req, res) {
	let errors = req.validationErrors();
	if (errors) {
		console.log(errors);
		res.json({ success: false, message: 'validation error', errors: errors });
	} else {
		console.log(req.body);
		function gen_id() {
			let dash = crypto.randomBytes(20, function(err, buf) {
				var orderId = buf.toString('hex');
				return JSON.stringify(orderId);
			});
			console.log(dash);
		}
		var randomString = function(len, bits) {
			bits = bits || 36;
			var outStr = '',
				newStr;
			while (outStr.length < len) {
				newStr = Math.random().toString(bits).slice(2);
				outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
			}
			return outStr.toLowerCase();
		};

		let order = new OrderProduct(req.body);

		order.save().populate('products').then((data) => send_mail(data));
		//     let id = randomString(19, 16);

		function send_mail(data) {
			let trackerid = data.trackerid;
			api.Tracker.retrieve(trackerid).then((s) => sendTrackingId(s)).catch(console.log);
			function sendTrackingId(userdata) {
				let trackingUrl = userdata.public_url;
				transactionid = data.transactionId;

				let name = data.userDetails.firstname;
				let orderdate = data.createdOn.date;
				let products = [];
				let mapper = data.products.map(async (el) => {
					let producturl;
					let prod;
					let name;
					if (el.isCombo) {
						prod = await Combos.findById(el.comboId);
						name = prod.title;
						let urlpost = name.replace(/\s+/g, '-').toLowerCase();
						producturl = 'https://cbdbene.com/' + urlpost;
					} else {
						prod = await Product.findById(el.productId);
						name = prod.producttitle;
						let urlpost = name.replace(/\s+/g, '-').toLowerCase();
						producturl = 'https://cbdbene.com/' + urlpost;
					}

					let htmldata = `<tr>
					<td class="m_-1220850270213470107m_3747154870368339796photo"
					  style="width:150px;text-align:center;padding:16px 0 10px 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
					  <a href="${producturl}"
						style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
						target="_blank"
						data-saferedirecturl="${producturl}">
						<img id="m_-1220850270213470107m_3747154870368339796asin"
						  src="${prod.menuimage}"
						  style="border:0" class="CToWUd"> </a> </td>
					<td class="m_-1220850270213470107m_3747154870368339796name"
					  style="color:rgb(102,102,102);padding:10px 0 0 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
					  <a href="${producturl}"
						style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
						target="_blank"
						data-saferedirecturl="${producturl}">
						${name}</a> <br> Quantity: x${el.qty}
					 
					  <div>
						<table border="0" cellspacing="4" cellpadding="0" style="border-collapse:separate">
						  <tbody style="vertical-align:bottom">
							<tr>
							  <td
								style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							  </td>
							  <td
								style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
								<a href=""
								  title="Share on Facebook"
								  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
								  target="_blank"
								  data-saferedirecturl="">
								  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-facebook"
									style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
								  </i> </a> </td>
							  <td
								style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
								<a href=""
								  title="Share on Twitter"
								  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
								  target="_blank"
								  data-saferedirecturl="">
								  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-twitter"
									style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
								  </i> </a> </td>
							  <td
								style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
								<a href=""
								  title="Pin it on Pinterest"
								  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
								  target="_blank"
								  data-saferedirecturl="">
								  <i class="m_-1220850270213470107m_3747154870368339796a-icon m_-1220850270213470107m_3747154870368339796a-icon-share-pinterest"
									style="background-image:url(https://ci5.googleusercontent.com/proxy/XzNwRJKbhnsXfVONP4SC2iAS61oDTrMQaLLENiziobW4i_HmsO1y4v0eJm3eRJEC88tL9ZZQ3WxxIv7bVm3oxZjJ_dg6EWGwmEmySvP3iEGL6Wv-fhuHoRA1Y0EyI2UzPqlHhKjW6Cvn3CJ4PxQo_8YM65vqgH18ttxtVyRxFMjk7ryARGYNhZfSqtSoNXqK=s0-d-e1-ft#https://m.media-amazon.com/images/G/01/AUIClients/AmazonUIBaseCSS-sprite_1x-28bd59af93d9b1c745bb0aca4de58763b54df7cf._V2_.png);display:inline-block">
								  </i> </a> </td>
							</tr>
						  </tbody>
						</table>
					  </div>
					</td>
					<td class="m_-1220850270213470107m_3747154870368339796price"
					  style="text-align:right;font-size:14px;padding:10px 10px 0 10px;white-space:nowrap;vertical-align:top;line-height:16px;font-family:Arial,sans-serif">
					  <strong>${el.subtotal}</strong> <br> </td>
				  </tr>`;

					products.push(htmldata);
				});

				let html = `<!DOCTYPE html>
				<html lang="en">
				
				<head>
				  <meta charset="UTF-8">
				  <meta name="viewport" content="width=device-width, initial-scale=1.0">
				  <meta http-equiv="X-UA-Compatible" content="ie=edge">
				  <title>Document</title>
				  <style>
					.invoice {
					  display: block;
					  margin: auto;
					}
				  </style>
				</head>
				
				<body style="font-family: sans-serif">
				  <div class="invoice">
					<table id="m_-1220850270213470107m_3747154870368339796container" dir="ltr"
					  style="width:640px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse">
					  <tbody>
						<tr>
						  <td class="m_-1220850270213470107m_3747154870368339796frame"
							style="padding:0 20px 20px 20px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
							<table id="m_-1220850270213470107m_3747154870368339796main" style="width:100%;border-collapse:collapse">
							  <tbody>
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796header"
									  style="width:100%;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td rowspan="2" class="m_-1220850270213470107m_3747154870368339796logo"
											style="width:115px;padding:18px 0 0 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<a href="cbdbene.com"
											  title="Visit cbdbene.com"
											  style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
											  target="_blank"
											  data-saferedirecturl="cbdbene.com">
											  <img alt="cbdbbene.com"
												src="https://cbdbene.com/static/media/bene_new.ce8b3135.png"
												style="border:0;width:115px" class="CToWUd" height="120" width="80"> </a> </td>
										  <td class="m_-1220850270213470107m_3747154870368339796navigation"
											style="text-align:right;padding:5px 0;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
										  </td>
										  <td
											style="width:100%;padding:7px 5px 0;text-align:right;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif"
											class="m_-1220850270213470107m_3747154870368339796navigation">
											<a href="https://cbdbene.com/my-account"
											  style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
											  target="_blank"
											  data-saferedirecturl="https://cbdbene.com/my-account">Your
											  Orders</a> </td>
										  <td class="m_-1220850270213470107m_3747154870368339796navigation"
											style="text-align:right;padding:5px 0;border-bottom:1px solid rgb(204,204,204);white-space:nowrap;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<span
											  style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif"></span>
											<span
											  style="text-decoration:none;color:rgb(204,204,204);font-size:15px;font-family:Arial,sans-serif">&nbsp;|&nbsp;</span>
											<a href="https://cbdbene.com"
											  style="border-right:0px solid rgb(204,204,204);margin-right:0px;padding-right:0px;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
											  target="_blank"
											  data-saferedirecturl="cbdbene.com"><span
												class="il">Bene</span></a> </td>
										</tr>
										<tr>
										  <td colspan="3" class="m_-1220850270213470107m_3747154870368339796title"
											style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<h2
											  style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)!important">
											  Order Confirmation</h2> Order #<a
											  href="${trackingUrl}"
											  class="m_-1220850270213470107m_3747154870368339796inline-block"
											  style="display:inline-block;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
											  target="_blank"
											  data-saferedirecturl="${trackingUrl}">${transationid}</a>
										   
										  </td>
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796summary"
									  style="width:100%;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">
											  Hello ${name},</h3>
											<p style="margin:5px 0 0 0;font:12px/16px Arial,sans-serif">
											  Thank you for your order. We�ll send a confirmation when
											  your order ships. If you would like to view the status of your order, Track it by clicking <a
												href="${trackingUrl}"
												style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
												target="_blank"
												data-saferedirecturl="${trackingUrl}">here</a> on <span class="il"></span></p>
										  </td>
										</tr>
									   
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796desiredInformation"
									  style="width:100%;border-collapse:collapse">
									</table>
								  </td>
								</tr>
								<tr>
								  <td
									style="border-bottom:1px solid rgb(204,204,204);vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">
									  Order Details</h3>
								  </td>
								</tr>
								<tr>
								  <td
									style="padding-left:32px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796orderDetails"
									  style="width:100%;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td style="    padding-top: 24px; vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											Order #<a
											  href="${trackingUrl}"
											  class="m_-1220850270213470107m_3747154870368339796inline-block"
											  style="display:inline-block;text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
											  target="_blank"
											  data-saferedirecturl="${trackingUrl}">${transactionid}</a>
											<br> <span style="font-size:12px;color:rgb(102,102,102)">Placed
											  on ${orderdate}</span> </td>
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td
									style="padding-left:32px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796criticalInfo"
									  style="border-top:3px solid rgb(45,55,65);width:95%;border-collapse:collapse">
									 
								</tr>
								<tr>
								  <td
									style="padding-left:32px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table style="width:95%;border-collapse:collapse"
									  id="m_-1220850270213470107m_3747154870368339796itemDetails">
									  <tbody>
										${products}
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td
									style="padding-left:32px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table style="width:95%;border-collapse:collapse"
									  id="m_-1220850270213470107m_3747154870368339796costBreakdown">
									  <tbody>
										<tr>
										  <td colspan="2" class="m_-1220850270213470107m_3747154870368339796divider"
											style="border-top:1px solid rgb(234,234,234);padding:0 0 16px 0;text-align:right;line-height:18px;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
										  </td>
										</tr>
										<tr>
										  <td
											style="text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											Item Subtotal: </td>
										  <td class="m_-1220850270213470107m_3747154870368339796price"
											style="width:150px;text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											Rs.475.00 </td>
										</tr>
										<tr>
										  <td
											style="text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											Shipping &amp; Handling: </td>
										  <td class="m_-1220850270213470107m_3747154870368339796price"
											style="width:150px;text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											Rs.0.00 </td>
										</tr>
										<tr>
										  <td colspan="2"
											style="text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											<p style="margin:4px 0 0 0;font:12px/16px Arial,sans-serif"></p>
										  </td>
										</tr>
										<tr>
										  <td colspan="2"
											style="text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
											<p style="margin:4px 0 0 0;font:12px/16px Arial,sans-serif"></p>
										  </td>
										</tr>
										<tr>
										  <td class="m_-1220850270213470107m_3747154870368339796total"
											style="font-size:14px;font-weight:bold;font:12px/16px Arial,sans-serif;text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif">
											<strong>Order Total: </strong> </td>
										  <td class="m_-1220850270213470107m_3747154870368339796total"
											style="font-size:14px;font-weight:bold;font:12px/16px Arial,sans-serif;text-align:right;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif">
											<strong>Rs.475.00</strong> </td>
										</tr>
										<tr>
										  <td colspan="2" class="m_-1220850270213470107m_3747154870368339796end"
											style="padding:0 0 16px 0;text-align:right;line-height:18px;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
										  </td>
										</tr>
										<tr>
										  <td colspan="2" class="m_-1220850270213470107m_3747154870368339796divider"
											style="border-top:1px solid rgb(234,234,234);padding:0 0 16px 0;text-align:right;line-height:18px;vertical-align:top;font-size:12px;font-family:Arial,sans-serif">
										  </td>
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td
									style="padding-left:32px;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796orderDetails"
									  style="width:100%;border-collapse:collapse">
									  
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796selfService"
									  style="width:100%;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<p style="margin:4px 0 0 0;font:12px/16px Arial,sans-serif">
											   Visit our <a
												href="LEARNPAGELINK"
												style="text-decoration:none;color:rgb(0,102,153);font:12px/16px Arial,sans-serif"
												target="_blank"
												data-saferedirecturl="">Learn
												page</a> for more information. </p>
										  </td>
										</tr>
										<tr>
										 
										</tr>
										<tr>
										 
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796closing"
									  style="width:100%;padding:0 0 0 0;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<p
											  style="padding:0 0 20px 0;border-bottom:1px solid rgb(234,234,234);margin:10px 0 0 0;font:12px/16px Arial,sans-serif">
											  We hope to see you again soon. <br> <span
												class="m_-1220850270213470107m_3747154870368339796signature"
												style="font-size:16px;font-weight:bold"> <strong><span
													class="il">cbdbene</span>.com</strong> </span>
											</p>
										  </td>
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
								<tr>
								  
								</tr>
								<tr>
								  <td style="vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
									<table id="m_-1220850270213470107m_3747154870368339796legalCopy"
									  style="width:100%;border-collapse:collapse">
									  <tbody>
										<tr>
										  <td
											style="padding:20px 0 0 0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
										  </td>
										</tr>
										<tr>
										  <td
											style="padding:0;vertical-align:top;font-size:12px;line-height:16px;font-family:Arial,sans-serif">
											<p
											  style="font-size:11px;color:rgb(102,102,102);line-height:16px;margin:0 0 10px 0;font:11px">
											  Please do not reply to this
											  message. </p>
										  </td>
										</tr>
									  </tbody>
									</table>
								  </td>
								</tr>
							  </tbody>
							</table>
						  </td>
						</tr>
					  </tbody>
					</table>
				  </div>
				</body>
				
				</html>`;

				console.log(html);

				var mailOptions = {
					from: '"CBD Bene" <admin@cbdbene.com>',
					to: data.userdetails.email,
					subject: 'Order Placed - CBDBene',
					html
					// text: "Your order has been successfully placed. You can track your order with the link given below." +
					// "\n\n"  + trackingUrl
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					if (err) {
						console.log(err);
					}
				});
				console.log({ 'Order placed email sent': trackingUrl });
				res.json({ success: true, order: data });
				//   });
				//Creating a notification for User
				let notify = new Notify();
				(notify.title = 'New Order'),
					(notify.content = 'New Order Placed'),
					(notify.type = 'order'),
					(notify.vieworder = data._id);
				notify.save().then((data) => console.log(data));
				let referralid = req.body.referral;
				let orderidin = data._id;
				let ref_total = req.body.wholesubtotal;
				Referral.findByIdAndUpdate(
					referralid,
					{ $set: { converted: true, orderid: orderidin, amount: ref_total } },
					{ new: true }
				)
					.then((data) => console.log({ status: true, data }))
					.catch((err) => console.log({ status: false, error: err }));
				//     // let id = Math.random().toString(36).slice(2);
				//     // let id = (Math.random()*1e32).toString(36);
				//     console.log(id);
				// 	let product_ids = new Array();
				// 	let num = req.body.orderproduct.length - 1;
				// 	//Saving the order product first
				// 	for (i = 0; i <= num; i++) {
				// 		let orderProduct = new OrderProduct();
				//         orderProduct.productMetaId = req.body.orderproduct[i].productmetaid;
				//         orderProduct.producttitle = req.body.orderproduct[i].producttitle;
				// 		orderProduct.orderid = id;
				// 		orderProduct.quantity = req.body.orderproduct[i].quantity;
				// 		orderProduct.singleprice = req.body.orderproduct[i].singleprice;
				// 		orderProduct.orderdate = req.body.orderproduct[i].orderdate;
				// 		orderProduct.country = req.body.orderproduct[i].country;
				// 		orderProduct.isguest = req.body.orderproduct[i].isguest;
				// 		orderProduct.userid = req.body.orderproduct[i].userid;
				// 		orderProduct.subtotal = req.body.orderproduct[i].subtotal;
				//         orderProduct.selectedattribute = req.body.orderproduct[i].selectedattribute;
				//         await orderProduct.save().then((product) => product_ids.push(product));
				//     }
				// 	// function product1(product) {
				// 	// 	let product_id = product.id;
				//     make_order()
				//     // await OrderProduct.find({orderid: id}).then((data) => console.log(data));
				//    async function make_order(){
				//     console.log('in');
				//     let order = new Order();
				// 	order.orderid = id;
				// 	order.userid = req.body.userid;
				// 	order.orderid = id;
				// 	order.orderproducts = product_ids;
				// 	order.couponid = req.body.couponid;
				// 	order.coupondisc = req.body.coupondisc;
				// 	order.country = req.body.country;
				// 	order.offerprice = req.body.offerprice;
				// 	order.shippingmethod = req.body.shippingmethod;
				// 	order.wholesubtotal = req.body.wholesubtotal;
				// 	order.shippingcharge = req.body.shippingcharge;
				// 	order.orderdate = req.body.orderdate;
				// 	order.paymentmethod = req.body.paymentmethod;
				// 	order.ordernote = req.body.ordernote;
				//     order.userid = req.body.userid;
				//     order.grandtotal = req.body.grandtotal;
				// 	await order.save().then((order) => create_order_meta(order)).catch((err) => res.json({error: err}));

				// 	 function create_order_meta(order) {
				// 		let ordermeta = new orderMeta();
				// 		ordermeta.status = req.body.status;
				// 		ordermeta.paymentstatus = req.body.paymentstatus;
				// 		ordermeta.transactionid = req.body.transactionid;
				// 		ordermeta.country_tax = req.body.country_tax;
				// 		ordermeta.taxamount = req.body.taxamount;
				// 		ordermeta.isguest = req.body.isguest;
				// 		ordermeta.userdetails.country = req.body.userdetails.country;
				// 		ordermeta.userdetails.firstname = req.body.userdetails.firstname;
				// 		ordermeta.userdetails.lastname = req.body.userdetails.lastname;
				// 		ordermeta.userdetails.shippingaddress = req.body.userdetails.shippingaddress;
				// 		ordermeta.userdetails.billingaddress = req.body.userdetails.billingaddress;
				// 		ordermeta.userdetails.city = req.body.userdetails.city;
				// 		ordermeta.userdetails.state = req.body.userdetails.state;
				// 		ordermeta.userdetails.zipcode = req.body.userdetails.zipcode;
				// 		ordermeta.userdetails.phonenumber = req.body.userdetails.phonenumber;
				// 		ordermeta.orderstatus = req.body.orderstatus;
				// 		ordermeta.orderid = order.orderid;

				// 		ordermeta.save(function(err) {
				// 			if (err) {
				// 				res.json({
				// 					success: false,
				// 					message: 'Error in Saving Order meta',
				// 					errors: err
				// 				});

				// 				return;
				// 			} else {
				// 				res.json({
				// 					success: true,
				// 					message: 'OrderMeta added succesfully'
				// 				});
				// 			}
				// 		});
				//     }}
			}
		}
	}
});

router.get('/getorders', function(req, res) {
	OrderProduct.find({})
		.then((data) => res.json({ status: true, orders: data }))
		.catch((err) => res.json({ status: false, error: err }));
	// 		if (err) {
	// 			res.json({ success: false, message: err });
	// 		} else {
	// 			console.log(orders)
	// 			res.json({ success: true, orders: orders });
	// 		}
	// 	}).sort({ orderdate: 'desc' });
	// } else {
	// 	res.json({ success: false, message: 'User Id is empty' });
	// }
});

// router.get('/getorderbyid', function (req, res) {
//     if( req.query.orderid ) {
//         Order.find({orderid: req.query.orderid}, function (err, orders) {
//             if (err) {
//                 res.json({ 'success': false, 'message': err });
//             } else {
//                 res.json({ 'success': true, 'orders': orders });
//             }
//         }).sort({_id: 'asc'});
//     } else {
//         res.json({ 'success': false, 'message': 'User Id is empty' });
//     }
// });

// router.get('/orderdetail', ensureAuthenticated, function (req, res) {
//     const firstDay = moment().tz("Asia/Kolkata").startOf('month');
//     const lastDay   = moment().tz("Asia/Kolkata").endOf('month');
//     Order.
//     find({$and: [{orderdate:{$gte:firstDay}},{orderdate:{$lte:lastDay}}]}).
//       populate('userid').
//       sort({_id: 'desc'}).
//       exec(function (err, orders) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('order_details_page.hbs', {
//                 pageTitle: 'Order Details Page',
//                 orders: orders
//             });
//         }
//     });
// });

// router.post('/orderdetail', function(req, res) {
//     var startdate = req.body.startdate;
//     var enddate = req.body.enddate;
//     const startmiliseconds = moment(startdate, "DD/MM/YYYY").tz("Asia/Kolkata").startOf('month').format('x');
//     const endmiliseconds = moment(enddate, "DD/MM/YYYY").tz("Asia/Kolkata").endOf('month').format('x');
//     Order.
//     find({$and: [{ordermilisecond:{$gte:startmiliseconds}},{ordermilisecond:{$lte:endmiliseconds}}]}).
//     populate('userid').
//     sort({orderid: 'desc'})
//     .exec(function (err, orders) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.json({ 'success': true, 'orders': orders });
//         }
//     });
// });

// router.get('/ordersingledetail', function(req, res){
//     var key = req.query.key
//     key = key.split('-').join('&');
//     Order.
// findById(req.query.id).
//   populate('userid').
//   sort({_id: 'desc'}).
//   exec(function (err, order) {
//     if (err) {
//         console.log(err);
//     } else {
//         var orderobject = {};
//         orderobject.date = order.ordermilisecond;
//         orderobject.customername = order.customername;
//         orderobject.brokername = order.brokername;
//         orderobject.customernumber = order.customernumber;
//         orderobject.brokernumber = order.brokernumber;
//         orderobject.user_id = order.user_id;
//         orderobject.id = order._id;
//         orderobject.orderid = order.orderid;
//         orderobject.amount = order.amount;
//         orderobject.ordernote = order.ordernote;
//         orderobject.userid = order.userid;
//         orderobject.transportcharge = order.transportcharge;
//         orderobject.key = key;
//         let cartarray = order.cartobject;
//         for (let index = 0; index < cartarray.length; index++) {
//             let delivary = cartarray[index][key];
//             if (typeof delivary === "undefined") {
//                 console.log("something is undefined");
//             } else {
//                 res.render('order_single_details.hbs', {
//                     pageTitle: 'Order Single Detail',
//                     delivary: delivary,
//                     orderobject: orderobject,
//                     objectindex: index
//                 });
//             }
//         }
//     }
//   });
// });

// router.post('/ordersingledetail', function(req, res){
//     var key = req.body.objectkey;
//     var deliveredQty = req.body.delivaryquantity;
//     var quantity = req.body.quantity;
//     var balancequantity = quantity - deliveredQty;
//     req.checkBody('orderid', 'Order ID is required').notEmpty();
//     req.checkBody('orderid', 'Order ID Shuold be Number only').isNumeric();
//     req.checkBody('delivaryquantity', 'Delivary Quantity is required').notEmpty();
//     req.checkBody('delivaryquantity', 'Delivary Quantity Shuold be Number only').isNumeric();
//     req.checkBody('balancequantity', 'Balanced Quantity is required').notEmpty();
//     req.checkBody('balancequantity', 'Balanced Quantity Shuold be Number only').isNumeric();
//     req.checkBody('userid', 'User ID is required').notEmpty();
//     let errors = req.validationErrors();
//     if (errors) {
//         res.render('order_details_page.hbs', {
//             pageTitle: 'Order Details Page',
//             errors: errors
//         });
//     } else {
//         let cartKey = 'cartobject.'+key;
//         let query = {};
//         query.orderid = req.body.orderid;
//         query[cartKey] = { $exists: true };
//         var setObject = {};
//         setObject["cartobject.$."+ key +".deliveredQty"] = deliveredQty;
//         setObject["cartobject.$."+ key +".balanceQty"] = balancequantity;
//         Order.updateOne(query, {'$set': setObject}, function(err, obj) {
//             if(err) {
//                 console.log(err);
//                 res.render('order_details_page.hbs', {
//                     pageTitle: 'Order Details Page',
//                     errors: err
//                 });
//             } else {
//                 if(obj.nModified != 0) {
//                     Delivery.count({}, function(err, count) {
//                         console.log(err);
//                         let cartobject = {};
//                         cartobject.sku = req.body.sku;
//                         cartobject.brandSerialNumber = req.body.brandSerialNumber;
//                         cartobject.quantity = quantity;
//                         cartobject.productName = req.body.productName;
//                         cartobject.brand = req.body.brand;
//                         cartobject.pack = req.body.pack;
//                         cartobject.price = req.body.price;
//                         cartobject.brandPrice = req.body.brandPrice;
//                         cartobject.deliveredQty = deliveredQty;
//                         cartobject.balanceQty = balancequantity;
//                         cartobject.offerPrice = req.body.offerPrice;
//                         cartobject.staticOfferPrice = req.body.staticOfferPrice;
//                         cartobject.offerId = req.body.offerId;
//                         let delivery = new Delivery();
//                         var date = moment().tz("Asia/Kolkata");
//                         delivery.deliveryid = count + 1;
//                         delivery.orderid = req.body.orderid;
//                         delivery.customernumber = req.body.customernumber;
//                         delivery.brokernumber = req.body.brokernumber;
//                         delivery.user_id = req.body.user_id;
//                         delivery.orderdate = req.body.orderdate;
//                         delivery.deliverydate = date;
//                         delivery.cartobject = cartobject;
//                         delivery.deliverymilisecond = moment().tz("Asia/Kolkata").format('x');
//                         delivery.userid = req.body.userid;
//                         delivery.save(function (err) {
//                             if (err) {
//                                 console.log(err);
//                                 res.render('order_details_page.hbs', {
//                                     pageTitle: 'Order Details Page',
//                                     errors: err
//                                 });
//                             } else {
//                                 var orderdate = moment(req.body.orderdate, "x").tz("Asia/Kolkata").format('DD/MM/YYYY h:mm:ss a');
//                                 var userid = req.body.userid;
//                                 var title = "Order Items Delivered";
//                                 var offermessage = 'Suplier has Delivered '+deliveredQty+' quantity of '+req.body.productName +' '+req.body.brand+' '+req.body.pack.packvalue+' kg for your order Id '+req.body.orderid+' done on '+orderdate;
//                                 var notificationtime = moment().tz("Asia/Kolkata").format('x');
//                                 var type = "Specific";
//                                 var flag = 0;
//                                 let notification = new Notification();
//                                 notification.title = title;
//                                 notification.content = offermessage;
//                                 notification.type = type;
//                                 notification.notificationtime = notificationtime;
//                                 notification.readflag = flag;
//                                 notification.userid = userid;
//                                 notification.save(function (err) {
//                                     if (err) {
//                                         console.log(err);
//                                         return;
//                                     } else {
//                                         console.log('notification saved successfully');
//                                     }
//                                 });
//                                 req.flash('success', 'Delivary Updated');
//                                 res.redirect('/orders/orderdetail');
//                             }
//                         });
//                     });
//                 } else {
//                     res.render('order_details_page.hbs', {
//                         pageTitle: 'Order Details Page',
//                         errors: 'Update Operation failed'
//                     });
//                 }
//             }
//         });
//     }
// });

// router.get('/all', function (req, res) {
// //     OrderProduct.
// // find({}).
// //   sort({_id: 'desc'}).
// //   exec(function (err, orders) {
// //     if(err) {
// //         console.log(err);
// //     } else {
//         res.render('all_orders.hbs', {
//             pageTitle: 'All Orders'
//         });
// //     }
// //   });

// // res.status({data});
// });

// router.get('/allorder',function (req, res) {
//     Order.
// find({}).
//   populate('userid').
//   sort({_id: 'desc'}).
//   exec(function (err, orders) {
//     if(err) {
//         res.json({ 'success': false, 'message': err });
//     } else {
//         res.json({ 'success': true, 'orders': orders });
//     }
//   });
// });

// router.get('/allorderbydate',function (req, res) {
//     var DateSplit, orderDate, start, end, startmiliseconds, endmiliseconds ;
//     if(req.query.date) {
//         startmiliseconds = moment(orderDate, "DD/MM/YYYY").tz("Asia/Kolkata").startOf('day').format('x');
//         endmiliseconds = moment(orderDate, "DD/MM/YYYY").tz("Asia/Kolkata").endOf('day').format('x');
//     } else {
//         startmiliseconds = moment().tz("Asia/Kolkata").startOf('day').format('x');
//         endmiliseconds = moment().tz("Asia/Kolkata").endOf('day').format('x');
//     }
//     Order.
//     find({$and: [{ordermilisecond:{$gte:startmiliseconds}},{ordermilisecond:{$lte:endmiliseconds}}]}).
//       populate('userid').
//       sort({_id: 'desc'}).
//       exec(function (err, orders) {
//         if(err) {
//             res.json({ 'success': false, 'message': err });
//         } else {
//             res.json({ 'success': true, 'orders': orders });
//         }
//       });
// });

// router.get('/deliverybyuserid',function (req, res) {
//     Delivery.find({userid: req.query.userid, paymentflag: 0}, 'deliveryid', function (err, deliveries) {
//         if (err) {
//             res.json({ 'success': false, 'message': err });
//         } else {
//             res.json({ 'success': true, 'deliveries': deliveries });
//         }
//     }).sort({_id: 'desc'});
// });

// router.get('/deliverybydeliveryid',function (req, res) {
//     Delivery.findById(req.query.id, function (err, delivery) {
//         if (err) {
//             res.json({ 'success': false, 'message': err });
//         } else {
//             res.json({ 'success': true, 'delivery': delivery });
//         }
//     }).sort({_id: 'desc'});
// });

// router.get('/deliverybyorderid',function (req, res) {
//     Order.findOne({orderid: req.query.orderid}, function (err, order) {
//         if (err) {
//             res.json({ 'success': false, 'message': err });
//         } else {
//             Delivery.find({orderid: req.query.orderid}, function (err, deliveries) {
//                 if (err) {
//                     res.json({ 'success': false, 'message': err });
//                 } else {
//                     res.json({ 'success': true, 'deliveries': deliveries, 'order': order });
//                 }
//             }).sort({_id: 'desc'});
//         }
//     }).sort({_id: 'desc'});
// });

router.get('/:id', function(req, res) {
	OrderProduct.findById(req.params.id).populate('userid').sort({ _id: 'desc' }).exec(function(err, order) {
		if (err) {
			console.log(err);
		} else {
			let trackerid = order.trackerid;
			api.Tracker.retrieve(trackerid).then((s) => sendTrackingId(s)).catch(console.log);
			function sendTrackingId(data) {
				let orderwithtracking = { ...order, trackurl: data.public_url };
				console.log(orderwithtracking);
				res.render('order_single.hbs', {
					pageTitle: 'Order',
					order: orderwithtracking
				});
			}
		}
	});
});

// router.delete('/:id', function(req, res){
//     if(!req.user._id){
//       res.status(500).send();
//     }
//     let query = {_id:req.params.id}
//     Order.findById(req.params.id, function(err, order){
//         Order.remove(query, function(err){
//           if(err){
//             console.log(err);
//           }
//           res.send('Success');
//         });
//     });
// });

// // Access Control
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         req.flash('danger', 'Please login');
//         req.session.returnTo = req.originalUrl;
//         res.redirect('/users/login');
//     }
// }

module.exports = router;
