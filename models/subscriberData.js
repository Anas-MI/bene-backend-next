const mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Affiliation Schema
const subscriberData = mongoose.Schema({
  email: { type: String },
});

const SubscriberData = (module.exports = mongoose.model(
  "subscriberData",
  subscriberData
));
