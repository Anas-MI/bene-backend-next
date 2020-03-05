const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
var Schema = mongoose.Schema;
// Packaging Type Schema Schema
const packagingType = mongoose.Schema({
	packingid: { type: Number, required: true },
	packingtype: { type: String },
	description: { type: String },
	capacity: { type: String },
	capcolor: { type: String },
	capsize: { type: String },
	capstyle: { type: String },
	diameter: { type: Number },
	diptube: { type: Number },
	labelpaneldimension: { type: String },
	height: { type: Number },
	containerweight: { type: Number },
	containervolume: { type: Number }
});

const packagingtype = (module.exports = mongoose.model('packagingType', packagingType));
