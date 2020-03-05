const mongoose          = require('mongoose');
const AutoIncrement     = require('mongoose-sequence')(mongoose);
const Schema            = mongoose.Schema;

let productReviewSchema = Schema({
    reviewid: {
        type: Number
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nickname: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    productid: {
        type: Schema.Types.ObjectId, ref: 'Product',
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId, ref: 'UserMeta2',
        required: true
    },
    creationdate: {
        type: Date,
        default: Date.now
    }
});

productReviewSchema.plugin(AutoIncrement, {inc_field: 'reviewid'});
let ProductReview = module.exports = mongoose.model('ProductReview', productReviewSchema);