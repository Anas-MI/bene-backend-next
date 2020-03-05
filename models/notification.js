let mongoose = require('mongoose');
var Schema = mongoose.Schema;
let notificationSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    notificationtime: {
        type: Date, default: Date.now
    },
    readflag: {
        type: Boolean,
        default: false
    },
    vieworder:{
        type: Schema.Types.ObjectId, ref: 'Orders'
    },
    readby: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

let Notification = module.exports = mongoose.model('Notification', notificationSchema);