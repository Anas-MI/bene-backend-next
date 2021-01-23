const express = require("express");
const router = express.Router();
const DB = require("../config/database");
const SubscriberData = DB.SubscriberData;
const nodemailer = require('nodemailer');
require('dotenv').config();
var sesTransport = require('nodemailer-ses-transport');
let smtpTransport = nodemailer.createTransport(sesTransport({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
}));
router.get("/get", (req, res) => {
  SubscriberData.find().then((result) => res.status(200).json(result));
});

router.post("/add", (req, res) => {
  let subscriberData = new SubscriberData(req.body);
  SubscriberData.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      return res
        .status(200)
        .json({ message: "Email has already been subscribed !" });
    } else {
      subscriberData.save().then((result) => {
        var userEmail = result.email;
        var emailText = 'Thank you for subscribing Us.';

        var mailOptions = {
          from: '"CBD Bene" <admin@precedentonline.com>',
          to: userEmail,
          subject: 'Suscribe - CBDBene',
          html: emailText
        };
        smtpTransport.sendMail(mailOptions, (error, response) => {
          // console.log(here);
          if (error) {
            console.log(error);
            return res.status(404).json({ success: false, message: error });
          } else {
            console.log(response);
            return res.status(200).json({ success: true, message: 'Thank you for Subscribing !' });
            smtpTransport.close();
          }
        });

      }
      );
    }
  });
});

module.exports = router;
