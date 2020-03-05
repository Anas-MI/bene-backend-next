const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Affiliation Schema
const affiliation = mongoose.Schema({

fname:{type: String},
lname:{type:String},
email:{type: String},
password:{type: String},
phonenumber:{type: String},
profession:{type: String},
website:{type:String},
instagram:{type: String},
facebook:{type: String},
zipcode:{type: Number},
networksize:{type: String},
why:{type:String},
extention:{type: String}, 
//refcode:{type: String},
ambass_id:{type: Number},
urlvisits:[{ type: Schema.Types.ObjectId, ref:'Referralvisits'}],
account:{type: Object},
bank:{type:Object},
tax:{type: Object},
createdon:{type: Date, default: Date.now},
status:{type: Boolean, default: false}
});

const Affiliation  = (module.exports = mongoose.model('ambassador', affiliation));
