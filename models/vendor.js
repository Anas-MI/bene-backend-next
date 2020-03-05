const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Packaging Type Schema Schema
const vendor = mongoose.Schema({
	vendorid:{type: Number},
    vendorname:{type: String}
});

const Vendor = (module.exports = mongoose.model('Vendor', vendor));
