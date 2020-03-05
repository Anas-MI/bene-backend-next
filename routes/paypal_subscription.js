var paypal = require('paypal-rest-sdk');
var url = require('url');
var express = require('express');
var path = require('path');
var app = express();
const router = express.Router();
const DB = require('../config/database');
const Paypal = DB.Paypal;
const Usermeta2 = require('../models/usermeta2');
paypal.configure({
    mode: 'sandbox', //Change this to live
    host: 'api.sandbox.paypal.com',
    client_id: 'AUC6qv21q0FeTi0Wqo2p6BVBrFumkA6te3RbBNrmpxpgnuMn-oWAZQtB-CpXy6ZOoDSYxKiwEwBhi3tT',
    client_secret:
        'EEcdrIwBiLseZwYgUqbe2aYTxbPi-KuZSpHfa0UTBr04tjMD2qZNHWCo71cQI0K49MdXvt_OWE1ZspIF'
});

// var config = {};

// /*
//  * SDK configuration
//  */

// exports.init = function (c) {
//     config = c;
//     paypal.configure(c.api);
// }

//Route to save user details after succesfull payment
router.post('/paypal/save/paymentdetails', async function(req, res) {
    let userid = req.body.userid;

    let paypal = new Paypal({
        userid: req.body.userid,
        paymentdetails: req.body.paypaldetails
    });

    await paypal.save().then((data) => addtometa(data));

    async function addtometa(data) {
        await Usermeta2.findOneAndUpdate(
            { userid },
            { $push: { paypaldetails: data._id } },
            { new: true }
        )
            .populate('paypaldetails')
            .then((data) => res.json({ status: true, user: data }))
            .catch((err) => res.json({ status: false, error: err }));
    }
});
//Code for creating a billing plan

router.post('/paypal/createplan', function(req, res) {
    var billingPlanAttribs = {
        name: req.body.name, //name of the plan
        description: req.body.description, //Description of this plan
        type: 'fixed',
        payment_definitions: [
            {
                name: 'Standard Plan',
                type: 'REGULAR',
                frequency_interval: req.body.interval,
                frequency: 'MONTH',
                cycles: '12',
                amount: {
                    currency: req.body.currency, //currency
                    value: req.body.amount //amount
                }
            }
        ],
        merchant_preferences: {
            setup_fee: {
                currency: 'USD',
                value: '1'
            },
            cancel_url: process.env.serverurl + '/cancel',
            return_url: process.env.serverurl + '/processagreement',
            max_fail_attempts: '0',
            auto_bill_amount: 'YES',
            initial_fail_amount_action: 'CONTINUE'
        }
    };

    var billingPlanUpdateAttributes = [
        {
            op: 'replace',
            path: '/',
            value: {
                state: 'ACTIVE'
            }
        }
    ];

    paypal.billingPlan.create(billingPlanAttribs, async function(error, billingPlan) {
        
        

        if (error) {
            console.log(error);
            res.json({ status: false, error });
            throw error;
        } else {
            // Activate the plan by changing status to Active
            console.log(billingPlan);
            paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, async function(
                error,
                response
            ) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    let paypalid = req.body.paypalid;
                    let paypal = {};

                    paypal.plandetails = billingPlan;
                    paypal.userdetails = req.body.userdetails;
                    paypal.planid = billingPlan.id;

                    await Paypal.findByIdAndUpdate(paypalid, paypal, {
                        new: true
                    })
                        .populate('userid')
                        .then((data) =>
                            res.json({
                                status: true,
                                planid: billingPlan.id,
                                billingplan: billingPlan,
                                saveddetails: data
                            })
                        )
                        .catch((err) => res.json({ status: false, error: err }));
                    console.log(billingPlan.id);
                }
            });
        }
    });
});

//Creating a billing agreement
router.post('/paypal/createagreement', function(req, res) {
    
    //Post the plan id inthe body with this request 
    var billingPlan = req.body.planid;

    var isoDate = new Date();
    var isoDate = new Date(Date.now() + (5 * 60 * 1000));
    console.log("--------------------------------------------------")
    console.log(isoDate, new Date());
    isoDate.setSeconds(isoDate.getSeconds() + 4);
    isoDate.toISOString().slice(0, 19) + 'Z';
    console.log({isoDate})

    var billingAgreementAttributes = {
        name: req.body.name,
        description: req.body.description,
        start_date: isoDate,
        plan: {
            id: billingPlan
        },
        payer: {
            payment_method: 'paypal'
        },
        shipping_address: req.body.shippingaddress
    };


    console.log({billingAgreementAttributes})
    //Use activated billing plan to create agreement
    paypal.billingAgreement.create(billingAgreementAttributes, function(error, billingAgreement) {
        if (error) {
            console.error(error);
            res.status(404).json({error});
        } else {
            //capture HATEOAS links
            var links = {};
            billingAgreement.links.forEach(function(linkObj) {
                console.log(linkObj);
                links[linkObj.rel] = {
                    href: linkObj.href,
                    method: linkObj.method
                };
            });

            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')) {
                // res.redirect(links['approval_url'].href);
                res.send(JSON.stringify(links));
            } else {
                console.error('no redirect URI present');
            }
        }
    });
});

//Code to process the agreement
router.post('/paypal/processagreement', function(req, res){
    var token = req.body.token;

    paypal.billingAgreement.execute(token, {}, function (error, 
        billingAgreement) {
        if (error) {
            console.error(error);
            res.status(404).json({error});
//throw error;
        } else {
            console.log(JSON.stringify(billingAgreement));
            res.send('Billing Agreement Created Successfully');
        }
    });
});



// exports.create = function (req, res) {
//     var amount =  req.body.amount; //Amount that has to be deduced
//     var currency = req.body.currency; // USD in this case
//     var description = req.body.description;
//     var payment = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             "return_url": "http://localhost:5000/success", //should be dynamic
//             "cancel_url": "http://localhost:5000/cancel"
//         },
//         "transactions": [{
//             "amount": {
//                 "total":parseInt(amount),
//                 "currency":  currency
//             },
//             "description": description
//         }]
//     };
//     paypal.payment.create(payment, function (error, payment) {
//         if (error) {
//             console.log(error);
//         } else {
//             if (payment.payer.payment_method === 'paypal') {
//                 req.session.paymentId = payment.id;
//                 var redirectUrl;
//                 for (var i = 0; i < payment.links.length; i++) {
//                     var link = payment.links[i];
//                     if (link.method === 'REDIRECT') {
//                         redirectUrl = link.href;
//                     }
//                 }
//                 res.redirect(redirectUrl);
//             }
//         }
//     });
// }

// exports.cancel = function (req, res) {
//     res.send("The payment got canceled");
// };

// exports.execute = function (req, res) {
//     var paymentId = req.session.paymentId;
//     var payerId = req.body.PayerID;

//     var details = {"payer_id": payerId};
//     paypal.payment.execute(paymentId, details, function (error, payment) {
//         if (error) {
//             console.log(error);
//         } else {
//             res.send({message:"Hell yeah!",data:payment});
//         }
//     });
// };

// //For billing agreement between the buyer and paypal.
// exports.createAgreement = function (req, res) {
//     var d = new Date(Date.now() + 1*60*1000);
//     d.setSeconds(d.getSeconds() + 4);
//     var isDate = d.toISOString();
//     var isoDate = isDate.slice(0, 19) + 'Z';

//     var billingPlanAttributes = {
//         "description": "Clearly Next Subscription.",
//         "merchant_preferences": {
//             "auto_bill_amount": "yes",
//             "cancel_url": "http://localhost:5000/cancel",
//             "initial_fail_amount_action": "continue",
//             "max_fail_attempts": "2",
//             "return_url": "http://localhost:5000/processagreement",
//             "setup_fee": {
//                 "currency": "USD",
//                 "value": "25"
//             }
//         },
//         "name": "Testing1-Regular1",
//         "payment_definitions": [
//             {
//                 "amount": {
//                     "currency": "USD",
//                     "value": "100"
//                 },
//                 "charge_models": [
//                     {
//                         "amount": {
//                             "currency": "USD",
//                             "value": "10.60"
//                         },
//                         "type": "SHIPPING"
//                     },
//                     {
//                         "amount": {
//                             "currency": "USD",
//                             "value": "20"
//                         },
//                         "type": "TAX"
//                     }
//                 ],
//                 "cycles": "0",
//                 "frequency": "MONTH",
//                 "frequency_interval": "1",
//                 "name": "Regular 1",
//                 "type": "REGULAR"
//             },
//             {
//                 "amount": {
//                     "currency": "USD",
//                     "value": "20"
//                 },
//                 "charge_models": [
//                     {
//                         "amount": {
//                             "currency": "USD",
//                             "value": "10.60"
//                         },
//                         "type": "SHIPPING"
//                     },
//                     {
//                         "amount": {
//                             "currency": "USD",
//                             "value": "20"
//                         },
//                         "type": "TAX"
//                     }
//                 ],
//                 "cycles": "4",
//                 "frequency": "MONTH",
//                 "frequency_interval": "1",
//                 "name": "Trial 1",
//                 "type": "TRIAL"
//             }
//         ],
//         "type": "INFINITE"
//     };

//     var billingPlanUpdateAttributes = [
//         {
//             "op": "replace",
//             "path": "/",
//             "value": {
//                 "state": "ACTIVE"
//             }
//         }
//     ];

//     var billingAgreementAttributes = {
//         "name": "Fast Speed Agreement",
//         "description": "Agreement for Fast Speed Plan",
//         "start_date": isoDate,
//         "plan": {
//             "id": "P-0NJ10521L3680291SOAQIVTQ"
//         },
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "shipping_address": {
//             "line1": "StayBr111idge Suites",
//             "line2": "Cro12ok Street",
//             "city": "San Jose",
//             "state": "CA",
//             "postal_code": "95112",
//             "country_code": "US"
//         }
//     };

// // Create the billing plan
//     paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
//         if (error) {
//             console.log(error);
//             throw error;
//         } else {
//             console.log("Create Billing Plan Response");
//             console.log(billingPlan);

//             // Activate the plan by changing status to Active
//             paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
//                 if (error) {
//                     console.log(error);
//                     throw error;
//                 } else {
//                     console.log("Billing Plan state changed to " + billingPlan.state);
//                     billingAgreementAttributes.plan.id = billingPlan.id;

//                     // Use activated billing plan to create agreement
//                     paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
//                         if (error) {
//                             console.log(error);
//                             throw error;
//                         } else {
//                             console.log("Create Billing Agreement Response");
//                             //console.log(billingAgreement);
//                             for (var index = 0; index < billingAgreement.links.length; index++) {
//                                 if (billingAgreement.links[index].rel === 'approval_url') {
//                                     var approval_url = billingAgreement.links[index].href;
//                                     console.log("For approving subscription via Paypal, first redirect user to");
//                                     console.log(approval_url);
//                                     res.redirect(approval_url);

//                                     console.log("Payment token is");
//                                     console.log(url.parse(approval_url, true).query.token);
//                                     // See billing_agreements/execute.js to see example for executing agreement
//                                     // after you have payment token
//                                 }
//                             }
//                         }
//                     });
//                 }
//             });
//         }
//     });
// };

// // Processing the final agreement.
// exports.processAgreement = function (req, res) {
//     var token = req.query.token;
//     console.log(token,'tokentoken');
//     paypal.billingAgreement.execute(token, {}, function (error, billingAgreement) {
//         if (error) {
//             console.error(error);
//             throw error;
//         } else {
//             console.log(JSON.stringify(billingAgreement));
//             res.send({message:'Billing Agreement Created Successfully',data:JSON.stringify(billingAgreement)});
//         }
//     });
// };

module.exports = router;