const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Packaging Type Schema Schema
const barcode = mongoose.Schema({
	barcode:{type: Number},
    checkdigit:{type: String},
    filename:{type: Number},
    formula:{type: Number},

});

const Barcode = (module.exports = mongoose.model('Barcode', barcode));
