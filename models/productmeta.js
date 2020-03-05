const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
// Product Schema
let productMetaSchema = Schema({
    producttype: {
        type: String,
        required: true
    },
    packagingtype:{type:Schema.Types.ObjectId, ref: 'packagingType'},
    vendorid:{type: Schema.Types.ObjectId, ref: 'Vendor'},
    visibilitytype:{type:Boolean},
    barcode:{type: String},
    featured:{type:Boolean},
    keyingredients: {
        type: String
    },
    allingredients:{
        type: String
    },
    attributecontent: {
        type: Array
    },
    dregularprice: {
        type: Number,
        required: true
    },
    dsaleprice: {
        type: Number
    },
    faqcontent: {
        type: Array
    },
    managestockstatus: {
        type: Boolean
    },
    soldindividual: {
        type: Boolean
    },
    unit: {
        type: Number
    },
    shipping_weight:{type: Number},
    shipping_length:{type: Number},
    shipping_width:{type: Number},
    shipping_height:{type: Number},
    shipping_class:{type: String},
    stock_status:{type: String},
    batch_no:{type: Number},
    expiry:{type: String},
    volume:{type: Number},
    weight:{type: Number},
    volumeunit: {type: String},
    enablereview: {
        type: Boolean,
        default: false
    },
    galleryimgdetails: {
        type: Array
    },
    sectionbimage:{
        type: String
    },
    attributes: {
        type: Array
    },
    variation: {
        type: Array
    },
    categoryid: [{ type : Schema.Types.ObjectId, ref: 'Category', required: true }],
    productid: {
        type: Schema.Types.ObjectId, ref: 'Product',
        required: true
    },
    asin:{type: String},
    use: {type : String},
    storage:{type: String},
    warning:{type: String},
    indication:{type: String},
    direction:{type: String},
    warranty:{type: String},
    totalcbdmg:{type: Number},
    cbdperunitmg:{type: Number},
    weight:{type: Number},
    servings:{type: String},
    servingsize:{type: String},
    fieldvalue:{type:String},
    fieldname:{type:String},
    labsheet:{type:String},
    reviews:[{type: Schema.Types.ObjectId, ref: 'Reviews'}]
});
let ProductMeta = module.exports = mongoose.model('ProductMeta', productMetaSchema);