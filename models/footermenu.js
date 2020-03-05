const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Menu Schema
let footerSchema = Schema({
    footerlabel: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    pagetype:{
        type: String
    },
    externallink:{
        type: String
    },
    category:{
        type: String
    },
    pagetitle:{
        type: String
    },
    pageid:{
        type: String
    },
    footerorder: {
        type: Number
    },
    parentid: {
        type: Schema.Types.ObjectId, ref: 'Footer',  required: true,
    }
});

let Menu = module.exports = mongoose.model('Footer', footerSchema);