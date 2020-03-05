let mongoose = require('mongoose');
var Schema = mongoose.Schema;
let orderMetaSchema = Schema({
	status: {
		type: String
	},
	paymentstatus: {
		type: String
	},
	transactionid: {
		type: String
	},
	country_tax: { type: String },
	taxamount: {
		type: String
	},
	isguest: { type: Boolean },
	userdetails: {
		type: Object
	},
	orderstatus: { type: String },
	orderid: {
		type: Schema.Types.ObjectId,
		ref: 'Order'
	}
});

let OrderMeta = (module.exports = mongoose.model('OrderMeta', orderMetaSchema));
