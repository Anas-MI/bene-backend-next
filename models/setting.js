let mongoose = require('mongoose');

let SettingSchema = mongoose.Schema({
    transportrate: {
        type: Number,
        required: true
    },
    referaldiscount: {
        type: Number,
        required: true
    },
    offeramout: {
        type: Number,
        required: true
    },
    settingchangedate: {
        type: Date,
        required: true,
        default: Date.now
    },
    settingchangemiliseconds: {
        type: Number,
        required: true
    }
});

let Setting = module.exports = mongoose.model('Setting', SettingSchema);