let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let orderedProduct = Schema({
    isCombo:{type: Boolean},
    comboId:{type: Schema.Types.ObjectId, ref: 'Combos'},
    productId:{type: Schema.Types.ObjectId, ref: 'Product'},
    productMeta:{type: Schema.Types.ObjectId, ref: 'ProductMeta'},
    isSubscribed:{type: Boolean},
    subscriptionFailed:{type:Boolean, default: false},
    subscriptionMeta:{type: Object},
    subscriptionId:{type: String},
    qty: {type: Number},
    unitPrice:{type: Number},
    subTotal:{type: Number},
    attribute:{type: Object},
    title:{type: String},
    reviewed:{type:Boolean, default: false},
    createdOn:{type: Date, default: Date.now}
})

let OrderedProduct = (module.exports = mongoose.model('orderedProducts', orderedProduct));