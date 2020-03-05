const express = require("express")
const app = express()
const router = express.Router();
const db = require('../config/database');
const userMeta = db.userMeta;
const User2 = require('../models/user2');
const Usermeta2 = require('../models/usermeta2');
//Api Login ID
const name = "3BgRr2498";
const Invoice = require("nodeice");

//Transaction Key
const transactionKey = "55RQx8xJ4d859UcH"

//Endpoint
const endpoint = "https://apitest.authorize.net/xml/v1/request.api";


//Function to make a HTTP Request
var request = require('request');

function makeHttpCall(postData, req, res) {
    var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
        const substring = 'E00003'
        const substring2 = "The transaction was unsuccessful"
        const substring3 = "errorCode"
        const substring4 = 'E00012'
        const substring5 = 'I00001' //Success code for subscription 
        const substring6 = 'I00002' //Error code for subscription
        let substring21 = "transactionResponse";
        let substring31 = "subscriptionId";
        const bankError = "E00027";
        const saveerror = "E00039";
        if (response.body.includes(substring) || response.body.includes(substring2) || response.body.includes(substring3) || response.body.includes(substring4)) {
            res.status(400).send({ status: false, details: response.body });
        } else if (response.body.includes(substring21)) {
            let transid = response.body.split('transId":"')[1].split('"refTransID"')[0].split("',")[0].slice(0, -2);
            res.status(200).send({ status: true, details: response.body, transactionid: transid })
        } else
            if (response.body.includes(substring31)) {
                let subid = response.body.split('subscriptionId":"')[1].split('"profile"')[0].slice(0, -2);
                console.log(subid);
                res.status(200).send({ status: true, details: response.body, subscriptionid: subid })
            }
            else if (response.body.includes(substring5)) {
                res.status(200).send({ status: true })
            } else if (response.body.includes(substring6)) {
                res.status(400).send({ status: false, details: response.body, message: "The subscription has already been cancelled" })
            } else if (response.body.includes(bankError)) {
                res.status(400).send({ status: false, details: response.body, message: "Invalid bank details" })
            } else {
                res.status(200).send({ status: true, details: response.body })
            }
    }
    );
}

function makeHttpCall2(postData, req, res) {
    var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
       let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
       res.send({status: true, data});
    })}

    function makeHttpCall3(postData, req, res) {
        var clientServerOptions = {
            uri: endpoint,
            body: JSON.stringify(postData),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions, function (error, response) {
           let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
           console.log({data })
           if( data.messages.resultCode ==='Error'){
            res.send({status: false, data})
           } else {
           if(data.messages.message[0].code === "I00001" || data.messages.message[0].resultCode === "Ok" || data.transactionResponse.responseCode === "1"){res.send({status: true, data})} else {res.send({status: false, data})};
    }})}
    
    

//Route to get the details back
router.get("/getdetails", (req, res) => {

    let postData = {
            "getCustomerProfileRequest": {
                "merchantAuthentication": {
                    name,
                    transactionKey
                },
                "customerProfileId": "1920385434",
                "includeIssuerInfo": "true"
            }
        }
    
        makeHttpCall2(postData, req, res)

}   )

//Route to save bank details
router.post("/savebank", (req, res) => {
let postData = {
    "createCustomerProfileRequest": {
        "merchantAuthentication": {
            name,
            transactionKey
        },
        "profile": {
            //"merchantCustomerId": "Merchant_Customer_ID",
            "description": req.body.userid,
            "email": req.body.email,
            "paymentProfiles": {
                "customerType": "individual",
                "payment": {
                    "creditCard": req.body.creditcard
                }
            }
        },
        "validationMode": "testMode"
    }
};

makeHttpCall2(postData, res, res)

});

// //Route to save password 
// router.post("/savecard", (req, res) => {
//     let postData = {
//             "createCustomerProfileRequest": {
//                 "merchantAuthentication": {
//                     name,
//                     transactionKey
//                 },
//                 "profile": {
//                     //"merchantCustomerId": "Merchant_Customer_ID",
//                     "description": req.body.userid,
//                     "email": req.body.email,
//                     "paymentProfiles": {
//                         "customerType": "individual",
//                         "payment": {
//                             "creditCard": req.body.creditcard
//                         }
//                     }
//                 },
//                 "validationMode": "testMode"
//             }
//         }
    
// makeHttpCall2(postData, req, res);

// });


//Route To charge a card 
router.post("/charge", (req, res) => {
    let postData = {
        "createTransactionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "transactionRequest": {
                "transactionType": "authCaptureTransaction",
                "amount": req.body.amount,
                "payment": {
                    "creditCard": {
                        "cardNumber": req.body.cardnumber,
                        "expirationDate": req.body.expiry,
                        "cardCode": req.body.cardcode
                    }
                },
                "lineItems": {
                    "lineItem": req.body.lineitems
                },
                "tax": {
                    "amount": req.body.tax.amount,
                    "name": req.body.tax.name,
                    "description": "Tax"
                },
                "shipping": {
                    "amount": req.body.shipping.amount,
                    "name": req.body.shipping.name,
                    "description": "Shipping Tax"
                },
               // "billTo": req.body.billTo,
               // "shipTo": req.body.shipTo,
		"billTo": {
                "firstName": "Ellen",
                "lastName": "Johnson",
                "company": "Souveniropolis",
                "address": "14 Main Street",
                "city": "Pecan Springs",
                "state": "TX",
                "zip": "44628",
                "country": "USA"
            },
            "shipTo": {
                "firstName": "China",
                "lastName": "Bayles",
                "company": "Thyme for Tea",
                "address": "12 Main Street",
                "city": "Pecan Springs",
                "state": "TX",
                "zip": "44628",
                "country": "USA"
            },
                "transactionSettings": {
                    "setting": {
                        "settingName": "testRequest",
                        "settingValue": "false"
                    }
                },
                "userFields": {
                }
            }
        }
    }
    makeHttpCall(postData, req, res)
});

//Route to charge a bank account 
router.post('/charge/bank', (req,res) => {
    
    const { billTo, shipTo, lineItems, amount, accountType, routingNumber, accountNumber, nameOnAccount } = req.body


    let postData = {
    "createTransactionRequest": {
        "merchantAuthentication": {
            name,
            transactionKey
        },
        "transactionRequest": {
            "transactionType": "authCaptureTransaction",
            amount,
            "payment": {
                "bankAccount": {
                    accountType,
                    routingNumber,
                    accountNumber,
                    nameOnAccount
                }
            },
            "tax": {
                "amount": req.body.tax.amount,
                "name": req.body.tax.name,
                "description": "Tax"
            },
            "shipping": {
                "amount": req.body.shipping.amount,
                "name": req.body.shipping,name,
                "description": "Shipping"
            },
            billTo,
            shipTo
        }
    }
}

makeHttpCall3(postData,req, res)
});




//Route to get the transaction details back through the transaction ID
router.post("/get/transaction", (req, res) => {

    let postData = {
        "getTransactionDetailsRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "transId": req.body.transid
        }
    }
    makeHttpCall(postData, req, res);
});

//Create a subscription 
router.post("/create/subscription", (req, res) => {
    let postData = {
        "ARBCreateSubscriptionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "subscription": {
                "name": req.body.name,
                "paymentSchedule": req.body.schedule,
                "amount": req.body.amount,
                //"trialAmount": "0.00",
                "payment": {
                    "creditCard": {
                        "cardNumber": req.body.cardnumber,
                        "expirationDate": req.body.expiry,
                        "cardCode": req.body.cardcode
                    }
                },
                "billTo": req.body.billto
            }
        }
    }
    makeHttpCall44(postData, req, res)
})

//Create a subscription through bank
router.post("/create/subscription/bank", (req, res) => {


    const {  accountType, routingNumber, accountNumber, nameOnAccount } = req.body


    let postData = {
        "ARBCreateSubscriptionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "subscription": {
                "name": req.body.name,
                "paymentSchedule": req.body.schedule,
                "amount": req.body.amount,
                //"trialAmount": "0.00",
                "payment": {
                    "bankAccount": {
                        accountType,
                        routingNumber,
                        accountNumber,
                        nameOnAccount
                    }
                },
                "billTo": req.body.billto
            }
        }
    }
    makeHttpCall44(postData, req, res)
})

router.get("/create/address", (req, res) => {

let postData = {
    "createCustomerPaymentProfileRequest": {
        "merchantAuthentication": {
      name,
      transactionKey
    },
      "customerProfileId": "1920386003",
      "paymentProfile": {
        "billTo": {
          "firstName": "John",
          "lastName": "Doe",
          "address": "123 Main St.",
          "city": "Bellevue",
          "state": "WA",
          "zip": "98004",
          "country": "USA",
          "phoneNumber": "000-000-0000"
        },
        "payment": {
          "creditCard": {
            "cardNumber": "4111111111111111",
            "expirationDate": "2023-12"
          }
        },
        "defaultPaymentProfile": false
      },
      "validationMode": "liveMode"
    }
  }

makeHttpCall3(postData, req, res)

})



//Create a subscription trhough profile id
router.post("/create/subscription/profile", (req, res) => {
   
  
   
    let postData = {
        "ARBCreateSubscriptionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "subscription": {
                "name": req.body.name,
                "paymentSchedule": req.body.schedule,
                "amount": req.body.amount,
                //"trialAmount": "0.00",
                "profile": {
                    "customerProfileId": req.body.profileid,
                    "customerPaymentProfileId": req.body.paymentid,

                }
            }

        }
    }
    makeHttpCall44(postData, req, res)


        
})


//Modify a subscription trhough profile id
router.post("/modify/subscription/profile", (req, res) => {
   
  
   
    let postData = {
        "ARBCreateSubscriptionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "subscriptionId": req.body.subscriptionid,
            "subscription": {
                "name": req.body.name,
                "paymentSchedule": req.body.schedule,
                "amount": req.body.amount,
                //"trialAmount": "0.00",
                "profile": {
                    "customerProfileId": req.body.profileid,
                    "customerPaymentProfileId": req.body.paymentid,

                }
            }

        }
    }
    makeHttpCall44(postData, req, res)


        
})



function makeHttpCall44(postData, req, res) {
    var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
       let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
       if(data.messages.message[0].code === "I00001" || data.messages.message[0].resultCode === "Ok" ){res.send({status: true, data, subscriptionid: data.subscriptionId })} else {res.send({status: false, data})};

       
    })}


//Route to get the list of subscription 
router.get("/list/subscription", (req, res) => {

    let postData =
    {
        "ARBGetSubscriptionListRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "searchType": "subscriptionActive",
            "sorting": {
                "orderBy": "id",
                "orderDescending": "false"
            },
            "paging": {
                "limit": "1000",
                "offset": "1"
            }
        }
    };

    makeHttpCall(postData, req, res);


});


//Route to cancel a subscriotion 
router.post("/cancel/subscription", (req, res) => {

    let postData = {
        "ARBCancelSubscriptionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "subscriptionId": req.body.subscriptionid
        }
    };

    makeHttpCall(postData, req, res);

});

//Route to save the details of the user first step 
router.post("/savecard",(req, res) => {
    let email = req.body.email;
    let creditCard, bankAccount, postData;
    if(req.body.creditcard){
    creditCard = req.body.creditcard;
     postData = {
        "createCustomerProfileRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "profile": {
                "description": "Profile description here",
                email,
                "paymentProfiles": {
                    "customerType": "individual",
                    "billTo": {
                        "firstName": "John",
                        "lastName": "Doe",
                        "address": "123 Main St.",
                        "city": "Bellevue",
                        "state": "WA",
                        "zip": "98004",
                        "country": "USA",
                        "phoneNumber": "000-000-0000"
                      },
                    "payment": {
                        creditCard    
                    }
                }
            },
            "validationMode": "testMode"
        }
    }

} else {
        bankAccount = req.body.bank;
        postData = {
            "createCustomerProfileRequest": {
                "merchantAuthentication": {
                    name,
                    transactionKey
                },
                "profile": {
                    "description": "Profile description here",
                    email,
                    "paymentProfiles": {
                        "customerType": "individual",
                        "billTo": {
                            "firstName": "John",
                            "lastName": "Doe",
                            "address": "123 Main St.",
                            "city": "Bellevue",
                            "state": "WA",
                            "zip": "98004",
                            "country": "USA",
                            "phoneNumber": "000-000-0000"
                          },
                        "payment": {
                            bankAccount    
                        }
                    }
                },
                "validationMode": "testMode"
            }
        }
    }
    let id = req.body.metaid;
   

    var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    request(clientServerOptions, function (error, response) {
       let data2 = JSON.parse(response.body.slice(1, -1).trim() + "}");
       if(data2.messages.message[0].code === "I00001" || data2.messages.message[0].resultCode === "Ok"){
        let postData2 = {
            "getCustomerPaymentProfileRequest": {
                "merchantAuthentication": {
                    name,
                    transactionKey
                },
                "customerProfileId": data2.customerProfileId,
                "customerPaymentProfileId": data2.customerPaymentProfileIdList[0],
                "includeIssuerInfo": "true"
            }
        }
        var clientServerOptions2 = {
            uri: endpoint,
            body: JSON.stringify(postData2),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions2, function (error, response) {
            let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
            if(data.messages.message[0].code === "I00001" || data.messages.message[0].resultCode === "Ok"){
             res.json({status: true, data:data2, card: data})
            }
         })
        let customerud = data2.customerProfileId
        Usermeta2.findByIdAndUpdate(id, {$set:{customerProfile:customerud}}).catch(console.log);
    } else if(data2.messages.message[0].code === "E00039" || data2.messages.message[0].resultCode === "Error"){
           res.json({status: false, data: data2})
        } else {
            res.json({status:false, data:data2})
        }
    })
});

//route to fetch the details back from the authrize server
router.post("/getcard", (req, res) => {

    let postData = {
        "getCustomerPaymentProfileRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "customerProfileId": req.body.profileid,
            "customerPaymentProfileId": req.body.paymentprofile,
            "includeIssuerInfo": "true"
        }
    }

    makeHttpCall2(postData, req, res)
});



// CHARGE A CUSTOMER PROFILE FROM SAVED CARD DETAILS
router.post("/chargeprofile", (req, res) => {

    let postData = {
        "createTransactionRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "transactionRequest": {
                "transactionType": "authCaptureTransaction",
                "amount": req.body.amount,
                  "profile": {
                      
//1833198215 paymentprofileid
//1920202381 customer profile id


                      "customerProfileId": req.body.profileid,
                      "paymentProfile": { "paymentProfileId": req.body.paymentid }
                  }
                // "lineItems": {
                //     "lineItem": {
                //         "itemId": "1",
                //         "name": "vase",
                //         "description": "Cannes logo",
                //         "quantity": "18",
                //         "unitPrice": "45.00"
                //     }
                // }
            }
        }
    }

    var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
        let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
        if(data.messages.message[0].code === "I00001" || data.messages.message[0].resultCode === "Ok"){
         console.log("created");
         res.json({status: true, data})
         // let customerud = data.customerProfileId
         //Usermeta2.findByIdAndUpdate(id, {$set:{customerProfile:customerud}}).catch(console.log);
     } else{ 
    //  if(data.messages.message[0].code === "E00039" || data.messages.message[0].resultCode === "Error"){
           console.log("failed");
          res.json({status: false, data})
         }
     })
});

// Route to update the custome rporfile 
router.get("/editprofile", (req, res) => {
    let postData = {
        "updateCustomerPaymentProfileRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "customerProfileId": "1920167243",
            //"clientId": "1920167243",
            "paymentProfile": {
                "payment": {
                    "creditCard": {
                        "cardNumber": "4242424242424242",
                        "expirationDate": "2026-01"
                    }
                },
                "defaultPaymentProfile": false,
                "customerPaymentProfileId": "20000"
            },
            "validationMode": "testMode"
        }
    }

    makeHttpCall2(postData, res, res);
});


//Route to delete a card 
router.post("/deletecard", (req, res) =>{
    let postData = 															
    {
        "deleteCustomerPaymentProfileRequest": {
            "merchantAuthentication": {
                name,
                transactionKey
            },
            "customerProfileId": req.body.profileid,
            "customerPaymentProfileId": req.body.paymentid
        }
    }
    
    makeHttpCall2(postData, res, res);
              
})


//route to add new cards second step
router.post("/addcard", (req, res) => {
    
    // profileid = req.body.profileid
    // creditcard = 
    let creditCard, bankAccount, postData;
    if(req.body.creditcard){
    creditCard = req.body.creditcard;
     postData  = {
        "createCustomerPaymentProfileRequest": {
            "merchantAuthentication": {
          name,
          transactionKey
        },
          "customerProfileId": req.body.profileid,
          "paymentProfile": {
            "billTo": {
                "firstName": "John",
                "lastName": "Doe",
                "address": "123 Main St.",
                "city": "Bellevue",
                "state": "WA",
                "zip": "98004",
                "country": "USA",
                "phoneNumber": "000-000-0000"
              },
            "payment": {
              "creditCard": req.body.creditcard
            },
            "defaultPaymentProfile": false
          },
          "validationMode": "testMode"
        }
      }

} else {
        bankAccount = req.body.bank;
         postData = {
            "createCustomerPaymentProfileRequest": {
                "merchantAuthentication": {
              name,
              transactionKey
            },
              "customerProfileId": req.body.profileid,
              "paymentProfile": {
                "payment": {
                  bankAccount
                },
                                "defaultPaymentProfile": false
              },
              "validationMode": "testMode"
            }
          }
    }
   

      var clientServerOptions = {
        uri: endpoint,
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    
    request(clientServerOptions, function (error, response) {
       let data = JSON.parse(response.body.slice(1, -1).trim() + "}");
       if(data.messages.message[0].code === "I00001" || data.messages.message[0].resultCode === "Ok"){
        
        let postData2 = {
            "getCustomerPaymentProfileRequest": {
                "merchantAuthentication": {
                    name,
                    transactionKey
                },
                "customerProfileId": data.customerProfileId,
                "customerPaymentProfileId": data.customerPaymentProfileId,
                "includeIssuerInfo": "true"
            }
        }
        var clientServerOptions2 = {
            uri: endpoint,
            body: JSON.stringify(postData2),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(clientServerOptions2, function (error, response) {
            let data2 = JSON.parse(response.body.slice(1, -1).trim() + "}");
            if(data2.messages.message[0].code === "I00001" || data2.messages.message[0].resultCode === "Ok"){
             res.json({status: true, data, card: data2})
            }
         })
    } else if(data.messages.message[0].code === "E00039" || data.messages.message[0].resultCode === "Error"){
          console.log("failed");
         res.json({status: false, data})
        } else {
            res.json({status: false, data})
        }
    })
});


router.get("/generateBill", (req,res) => {
    
 
// Create the new invoice
// Create the new invoice
let myInvoice = new Invoice({
    config: {
        template: __dirname + "/template/index.html"
      , tableRowBlock: __dirname + "/template/blocks/row.html"
    }
  , data: {
        currencyBalance: {
            main: 1
          , secondary: 3.67
        }
      , invoice: {
            number: {
                series: "PREFIX"
              , separator: "-"
              , id: 1
            }
          , date: "01/02/2019"
          , dueDate: "11/02/20149"
          , explanation: "Thank you for your business!"
          , currency: {
                main: "XXX"
              , secondary: "ZZZ"
            }
        }
      , tasks: [
            {
                description: "CBD Massage Gel"
              , unit: "Hours"
              , quantity: 5
              , unitPrice: 2
            }
          , {
                description: "CBD Gummies"
              , unit: "Hours"
              , quantity: 10
              , unitPrice: 3
            }
          , {
                description: "CBD Oil 300mg"
              , unit: "Hours"
              , quantity: 3
              , unitPrice: 5
            }
        ]
    }
  , seller: {
        company: "Bene LLC"
    //   , registrationNumber: "F05/XX/YYYY"
    //   , taxId: "00000000"
      , address: {
            street: "The Street Name"
          , number: "00"
          , zip: "000000"
          , city: "Some City"
          , region: "Some Region"
          , country: "Nowhere"
        }
      , phone: "+40 726 xxx xxx"
      , email: "support@cbdbene.com"
      , website: "cbdbene.com"
      , bank: {
            name: "Some Bank Name"
          , swift: "XXXXXX"
          , currency: "XXX"
          , iban: "..."
        }
    }
  , buyer: {
        company: "Dave"
      , taxId: "00000000"
      , address: {
            street: "The Street Name"
          , number: "00"
          , zip: "000000"
          , city: "Some City"
          , region: "Some Region"
          , country: "Nowhere"
        }
      , phone: "+40 726 xxx xxx"
      , email: "me@example.com"
      , website: "example.com"
      , bank: {
            name: "Some Bank Name"
          , swift: "XXXXXX"
          , currency: "XXX"
          , iban: "..."
        }
    }
});

// Render invoice as HTML and PDF
myInvoice.toHtml(__dirname + "/my-invoice.html", (err, data) => {
    console.log(data)
    console.log("Saved HTML file");
}).toPdf(__dirname + "/my-invoice.pdf", (err, data) => {
    console.log("Saved pdf file");
});
 
// // Serve the pdf via streams (no files)
// require("http").createServer((req, res) => {
//     myInvoice.toPdf({ output: res });
// }).listen(8000);
})


module.exports = router;