const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// User Meta Schema
const UserMetaSchema = Schema({
  firstname:{
    type: String
  },
  lastname:{
    type: String
  },
  billingdetails: {
    type: Array
  },
  shippingdetails: {
    type: Array
  },
  extradetails: {
    type: Array
  },
  userid: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  }
});

const UserMeta = module.exports = mongoose.model('UserMeta', UserMetaSchema);
