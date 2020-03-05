let mongoose = require('mongoose');
var Schema = mongoose.Schema;
let offerSchema = Schema({
    productname: {
        type: String,
        required: true
    },
    offerproductid: {
        type: Schema.Types.ObjectId, ref: 'Product',
        required: true
    },
    productbrand: {
        type: String,
    },
    offerinfo: {
        type: String,
        required: true
    },
    priceoffer: {
        type: String,
        required: true
    },
    priceofferunit:{
        type: String
    },
    priceofferapplied:{
        type: String
    },
    maxlimituser: {
        type: String,
        required: true
    },
    maxlimituserunit:{
        type: String
    },
    pack: {
        type: String
    },
    offerstartdate: {
        type: Date,
        required: true,
        default: Date.now
    },
    offerenddate: {
        type: Date,
        required: true,
        default: Date.now
    },
    startdatemiliseconds: {
        type: Number
    },
    enddatemiliseconds: {
        type: Number
    },
    filepath: {
        type: String,
        trim: true
    },
    filename: {
        type: String
    },
    offersize:{
        type: Number,
        required: true
    },
    offersizeunit:{
        type: String
    },
    offerremaingquantity:{
        type: Number,
        required: true
    }
});

let Offer = module.exports = mongoose.model('Offer', offerSchema);