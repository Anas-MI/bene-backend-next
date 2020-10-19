const { timeStamp } = require('console');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Affiliation Schema
const folderSchema = mongoose.Schema({
    name: {type: String},
    files: [
        {
            name: {type: String},
            path: {type: String}
        }
    ]
}, {timeStamp: true});

const folder  = module.exports = mongoose.model('folder', folderSchema);
