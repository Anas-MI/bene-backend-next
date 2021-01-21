const express = require("express"),
    router = express.Router(),
    nodemailer = require("nodemailer");
    var sesTransport = require('nodemailer-ses-transport');
    let smtpTransport = nodemailer.createTransport(sesTransport({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
    }));

router.get("/test", (req, res) => {
    let replyTo = "anas3rde@gmail.com"
    let from = '"CBD Bene" <admin@precedentonline.com>',
    to = "anas3rde@gmail.com"
   
    let mail = {
        from,
        to,
        replyTo,
        subject:"test",
        text:"jdklnkdln"
    }
    smtpTransport.sendMail(mail, function(err){
        if(err){
            console.log(err)
        }
        console.log("Contact us email sent");
        res.json({status: true})
    })

});



router.post("/", (req, res) => {
    const { name, email, text, subject } = req.body;
    let replyTo = email
    //let from = `${name} <${email}>`,
let from = "customer.support@cbdbene.com"    
to = "mkothary@gmail.com"
   


    let mail = {
        from,
        to,
        replyTo,
        subject,
        text
    }

console.log(mail)
    smtpTransport.sendMail(mail, function(err){
        if(err){
            console.log(err)
        }
        console.log("Contact us email sent");
        res.json({status: true})
    })

});

module.exports = router;
