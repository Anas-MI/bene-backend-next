const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// referral Schema
const referral = mongoose.Schema({

url:{type: String},
refer_url:{type: String},
converted:{type:Boolean, default: false},
date: {type: Date, default: Date.now},
orderid:{type: Schema.Types.ObjectId, ref:'Order'},
amount:{type: Number},
paid:{type: Boolean, default: false},
paidon:{type: Date},
combo:{type: Boolean, default: false},
productid:[{type: Schema.Types.ObjectId, ref:'Product'}],
comboid:[{type: Schema.Types.ObjectId, ref:'Combos'}]
});

const Referral  = (module.exports = mongoose.model('Referralvisits', referral));
