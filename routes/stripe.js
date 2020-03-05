const keyPublishable = 'pk_test_SVGwjErnIO8bMtXItRF8YkBW';
const keySecret = 'sk_test_uhakpGPvGKEGnOE5ljFB63Gt';
const Stripeuser = require('../models/stripe');
const express = require('express');
const app = express();
const router = express.Router();
const Usermeta2 = require("../models/usermeta2");
const stripe = require('stripe')(keySecret);

router.post('/token/find', function(req, res) {
	let query = req.body.token;
	stripe.tokens.retrieve(query, function(err, token) {
		if (err) {
			res.status(404).json({ status: false, error: err });
		} else {
			res.status(200).json({ status: true, details: token });
		}
	});
});

router.post('/token/create', function(req, res) {
	stripe.tokens.create(
		{
			card: {
				number: req.body.cardnumber,
				exp_month: req.body.expmonth,
				exp_year: req.body.expyear,
				cvc: req.body.cvc
			}
		},
		function(err, token) {
			if (err) {
				res.status(404).json({ status: false, error: err });
			} else {
				console.log(token);
				let stripe = new Stripeuser();
				if (req.body.userid) {
					stripe.userid = req.body.userid;
				}
				stripe.token = token;
				if (req.body.userdetails) {
					stripe.userdetails = req.body.userdetails;
				}
				stripe
					.save()
					.then((data) =>
						res.status(200).json({ status: true, token: token, details: data })
					)
					.catch((err) => res.json({ status: false, error: err }));
			}
		}
	);
});

router.post('/charge', function(req, res) {
	let amount = req.body.amount;

	// create a customer
	stripe.customers
		.create({
			email: req.body.stripeemail,
			source: req.body.stripetoken
		})
		.then((customer) => savedata(customer)).catch((err) => res.json({status: false, error: err}));
	// .then((charge) => res.json({ status: true, details: charge }));

	async function savedata(customer) {
		stripe.charges
			.create({
				amount,
				description: req.body.description,
				currency: 'usd',
				customer: customer.id
			})
			.then((data) => saveData(data))
	
		
			async function saveData(data){
			await Stripeuser.findOneAndUpdate(
			{ userid: req.body.userid },
			{ $set: { customerid: customer.id, stripedetails: data } }).then(() => res.json({ status: true, details: data }));
		
				}	;
	}})
;

router.post('/api/shop/order', async (req, res) => {
	const order = req.body.order;
	const source = req.body.source;
	try {
		const stripeOrder = await stripe.orders.create(order);
		console.log(`Order created: ${stripeOrder.id}`);
		await stripe.orders.pay(stripeOrder.id, { source });
	} catch (err) {
		// Handle stripe errors here: No such coupon, sku, ect
		console.log(`Order error: ${err}`);
		return res.sendStatus(404);
	}
	return res.sendStatus(200);
});

router.post('/coupon/generate', async (req, res) => {
	stripe.coupons.create(
		{
			percent_off: req.body.percentoff,
			duration: req.body.duration,
			duration_in_months: req.body.months,
			id: req.body.name
		},
		function(err, coupon) {
			if (err) {
				res.json({ status: false, error: err });
			} else {
				res.json({ status: true, coupon: coupon });
			}
		}
	);
});

//To genrate coupon from admin panel
router.get("/admin/coupon/generate/", (req, res) => {
	res.render("generateCoupon");
});

router.post("/admin/coupon/generate/", (req, res) => {
	console.log(req.body);
	let id = req.body.couponname.replace(/ /g,'');
	console.log({"After replacing": id})
	if(req.body.duration === "once"){
		stripe.coupons.create({
			percent_off: req.body.percentoff,
			duration: req.body.duration,
			id
		},
		function(err, coupon){
			if(err){
				console.log(err);
			} else {
				console.log(coupon);
				res.redirect("/stripe/coupon/admin/list/")
			}
		})
	} else {
		stripe.coupons.create({
			percent_off: req.body.percentoff,
			duration: req.body.duration,
			duration_in_months:req.body.months,
			id
		},
		function(err, coupon){
			if(err){
				console.log(err);
			} else {
				console.log(coupon);
				res.redirect("/stripe/coupon/admin/list/")
			}
		})
	}
})

//to retteive a coupon
router.get('/coupon/get', async (req, res) => {
	let query = req.query.coupon;
	stripe.coupons.retrieve(query, function(err, coupon) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, coupon: coupon });
		}
	});
});

//Show all the coupons in the backend 
router.get('/coupon/admin/list', (req, res) => {
stripe.coupons.list({}, function(err, coupons){
if(err){
	console.log(err)
} else {
	console.log(coupons)
	let couponslist = coupons.data;
	res.render("couponlist", {coupons: couponslist})
}
});
});

//Get all coupons
router.get('/coupon/list', async (req, res) => {
	stripe.coupons.list({ limit: 100 }, function(err, coupons) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, coupon: coupons });
		}
	});
});

//Delete route for coupons
router.get("/admin/coupon/list/:id", (req, res) => {
	let name = req.params.id;
	stripe.coupons.del(
		name,
		function(err, confirmation) {
		  if(err){
			  console.log(err)
		  } else {
			  console.log(confirmation);
			  res.status(200).json({success:true})
		  }
		}
	  );
});

//Creating a plan as per the options selected by user in their cart

router.post('/subscription/create', async (req, res) => {
	let name = req.body.name,
		amount = req.body.amount,
		interval = req.body.interval,
		currency = req.body.currency,
		//Interval is the anmount of times the billing should be done. if interval in month and count is 3. it will be billed per three months
		interval_count = req.body.intervalcount;
	stripe.plans.create(
		{
			amount,
			interval,
			interval_count,
			product: {
				name
			},
			currency
		},
		async function(err, plan) {
			if(err){
				res.json({status: true, error: err})
			} else {
				if(req.body.userid){
					await Usermeta2.findOneAndUpdate({userid: req.body.userid}, {$set: {"stripe_plan": plan}})}
				res.json({status: true, plan })
			}
		}
	);
});

//Attaching a subscription ot a particular custimer by its id
router.post("/subscription/attach", async(req, res) => {

let customer = req.body.customer, 
	plan = req.body.plan;


stripe.subscriptions.create({
  customer,
  items: [
    {
      plan,
    },
  ]
}, async function(err, subscription) {
    if(err){
		res.json({status: false, error: err})
	} else {
		if(req.body.userid){
			await Usermeta2.findOneAndUpdate({userid: req.body.userid}, {$set: {"stripe_subscription": subscription}})}
		res.json({status: true, subscription })
	}
  }
);
});




//List all plans
router.get("/listplans", async (req, res) => {
stripe.plans.list(
  { limit: 1000 },
  function(err, plans) {
	if(err){
		res.json({status: true, error: err})
	} else {
		
		res.json({status: true, plans })
	}
  }
);
})


//Rterieve a plan with a given id
router.get("/getplan/:id", async (req, res) => {
	stripe.plans.retrieve(
		req.query.id,
		function(err, plan) {
		  if(err){
			  res.json({status: false, error: err})
		  } else {
			  res.json({status: true, plan})
		  }
		}
	  );
});

//Attach a subscription plan to a particular customer
router.post('/subscription/customer', async (req, res) => {
	params = {
		customer: req.body.customer,
		plan: req.body.plan
	};

	//pass customer id and plan name into this in body
	stripe.subscriptions.create(
		{
			customer: params.customer,
			items: [
				{
					plan: params.plan
				}
			]
		},
		function(err, subscription) {
			if (err) {
				res.json({ status: false, error: err });
			} else {
				res.json({ status: true, subscription: subscription });
				// this will start charging as per our plans in maxxbio
			}
		}
	);
});

//Retrieve susbcription details after letting user subscribe to any particular product
router.post('/subscription/getinfo', async (req, res) => {
	//In body send id of the subscripotion that the user subscribed above

	let subid = req.body.subid;

	stripe.subscriptions.retrieve(subid, function(err, subscription) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, subscription: subscription });
		}
	});
});

//Update any subscription for any particualr customer
router.post('/subscription/update', async (req, res) => {
	let subid = req.body.subid;
	let orderid = req.body.orderid;

	stripe.subscriptions.update(subid, {
		metadata: { order_id: orderid },
		function(err, subscription) {
			if (err) {
				res.json({ status: false, error: err });
			} else {
				res.json({ status: true, subscription: subscription });
			}
		}
	});
});

router.post('/subscription/delete', async (req, res) => {
	let subid = req.body.subid;
	//send subid along with this post

	//Delete susbcription of any particular user
	stripe.subscriptions.del(subid, async function(err, confirmation) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			if(req.body.userid){
			await Usermeta2.findOneAndUpdate({userid: req.body.userid}, {$set: {stripe_plan: "cancelled", stripe_subscription: "cancelled"}})}
			res.json({ status: true, Confirmation: confirmation });
		}
	});
});

//List all the subscriptions
router.get('/subscription/listall', async (req, res) => {
	stripe.subscriptions.list({ limit: 100 }, function(err, subscriptions) {
		if (err) {
			res.json({ status: false, error: err });
		} else {
			res.json({ status: true, subscriptions: subscriptions });
		}
	});
});

module.exports = router;
