const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
var Schema = mongoose.Schema;
// User Schema
const paypal = mongoose.Schema({

userid:{type: Schema.Types.ObjectId, ref: 'User2'},
paymentdetails:{type: Object},
planid: {type: String},
plandetails:{type: Object},
userdetails: {type: Object},
createdon:{type: Date, default: Date.now}
})


const Paypal = module.exports = mongoose.model('Paypal', paypal);
