const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Category Schema
let categorySchema = Schema({
    categorytitle: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    categoryid: {
        type: Number
    },
    catdescription: {
        type: String,
        required: true
    },
    categoryslug: {
        type: String,
    },
    parentid: {
        type: Schema.Types.ObjectId, ref: 'Category',
    },
    filepath: {
        type: String,
        trim: true
    },
    filename: {
        type: String
    },
    blockedcountries: {
        type: Array
    }
});

categorySchema.plugin(AutoIncrement, {inc_field: 'categoryid'});
let Category = module.exports = mongoose.model('Category', categorySchema);