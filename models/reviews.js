const mongoose = require('mongoose')
var Schema = mongoose.Schema

//Review Schema
const Review = mongoose.Schema({
  title: { type: String },
  content: { type: String },
  name: { type: String },
  createdOn: { type: Date, default: Date.now() },
  rating: { type: Number },
  overall: { type: Number },
  effectiveness: { type: Number },
  quality: { type: Number },
  vmoney: { type: Number },
  userid: { type: Schema.Types.ObjectId, ref: 'User2' },
  usermetaid: { type: Schema.Types.ObjectId, ref: 'UserMeta2' },
  approved: { type: Boolean, default: false },
  productmetaid: { type: Schema.Types.ObjectId, ref: 'ProductMeta' },
  isCombo: { type: Boolean, default: false },
  comboid: { type: Schema.Types.ObjectId, ref: 'Combos' },
  orderid: { type: Schema.Types.ObjectId, ref: 'order' },
})

const review = (module.exports = mongoose.model('Reviews', Review))
