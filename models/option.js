const mongoose          = require('mongoose');
const AutoIncrement     = require('mongoose-sequence')(mongoose);
const Schema            = mongoose.Schema;

let optionSchema = Schema({
    optionid: {
        type: Number
    },
    optionname: {
        type: String
    },
    optionvalue: {
        type: Schema.Types.Mixed
    }
});

optionSchema.plugin(AutoIncrement, {inc_field: 'optionid'});
let Options = module.exports = mongoose.model('Options', optionSchema);