const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/bene');
let db = mongoose.connection;
db.once('open', function () {
    console.log('Connected to MongoDB New');
});

db.on('error', function (err) { 
    console.log(err);
}); 

mongoose.Promise = global.Promise; 


module.exports = {
User: require('../models/user'),
UserMeta: require('../models/usermeta'),
Category: require('../models/category'),
Product: require('../models/product'),
ProductMeta: require('../models/productmeta'),
Option: require('../models/option'),
Page: require('../models/page'),
Attribute: require('../models/productattribute'),
Review: require('../models/productreview'),
Subscribed: require('../models/subscribed'),
Wishlist: require("../models/wishlist"),
order: require("../models/order"),
orderMeta: require("../models/ordermeta"),
orderProduct: require("../models/order_product"),
Menu: require('../models/menu'),
Paypal: require("../models/paypal"),
// Setting: require('../models/setting'),
Notify: require('../models/notification'),
Footer: require('../models/footermenu'),
vendor: require("../models/vendor"),
packagetype:require("../models/packageType"),
barcodes: require("../models/barcode"),
combos: require("../models/combos"),
affiliation:require("../models/affiliation")
}
