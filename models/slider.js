let mongoose = require('mongoose');

let sliderSchema = mongoose.Schema({
    slidename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        trim: true,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    slidestatus: {
        type: String,
        required: true
    }
});

let Slider = module.exports = mongoose.model('Slider', sliderSchema);