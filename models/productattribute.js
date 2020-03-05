const mongoose          = require('mongoose');
const AutoIncrement     = require('mongoose-sequence')(mongoose);
const Schema            = mongoose.Schema;

let attributeSchema = Schema({
    attributeid: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    terms: {
        type: Object
    }
});

attributeSchema.plugin(AutoIncrement, {inc_field: 'attributeid'});
let Attribute = module.exports = mongoose.model('Attribute', attributeSchema);