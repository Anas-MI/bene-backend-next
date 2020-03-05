const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
var Schema = mongoose.Schema;
// User Schema
const stripe = mongoose.Schema({

userid:{type: Schema.Types.ObjectId, ref: 'User'},
token: {type: Object},
userdetails: {type: Object},
customerid:{type: String},
stripedetails: {type: Object}
})


const Stripe = module.exports = mongoose.model('Stripe', stripe);
