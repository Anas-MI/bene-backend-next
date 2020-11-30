const express = require("express");
const router = express.Router();
const DB = require("../config/database");
const SubscriberData = DB.SubscriberData;

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
      subscriberData.save().then((result) =>
        res.status(200).json({
          data: result,
          message: "Thank you for Subscribing !",
        })
      );
    }
  });
});

module.exports = router;
