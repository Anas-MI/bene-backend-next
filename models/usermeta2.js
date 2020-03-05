const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// User Meta Schema
const UserMetaSchema = Schema({
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	billingdetails: {
		type: Object
	},
	shippingdetails: {
		type: Object
	},
	carddetails:{
		type: Object
	},
	defaultaddress:{
		type: String
	},
	extradetails: {
		type: Array
	},
	userid: {
		type: Schema.Types.ObjectId,
		ref: 'User2',
		required: true
	},
	expresscheckout:{
		type: Boolean, default: false
	},
	zipcode: { type: Number },
	region: { type: String },
	country: { type: String },
	state: {
		type: String
	}, 
	stripe_plan:{
		type: Object
	},
	stripe_subscription:{
		type:Object 
	},
	orders:[{
		type: Schema.Types.ObjectId,
		ref: 'Order'
	}],
	cart:{type: Object},
	paypaldetails:[{type: Schema.Types.ObjectId,
		ref: 'Paypal'}],
		customerProfile:{type:String}
});

const UserMeta = (module.exports = mongoose.model('UserMeta2', UserMetaSchema));
