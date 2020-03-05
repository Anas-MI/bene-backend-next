const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Menu Schema
let menuSchema = Schema({
    menulabel: {
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
    // type:{
    //     type: String
    // },
    category:{
        type: String
    },
    pagetitle:{
        type: String
    },
    pageid:{
        type: String
    },
    menuid: {
        type: Number
    },
    menuorder: {
        type: Number
    },
    parentid: {
        type: Schema.Types.ObjectId, ref: 'Menu',  required: true,
    },
    blockedcountries: {
        type: Array
    }
});

menuSchema.plugin(AutoIncrement, {inc_field: 'menuid'});
let Menu = module.exports = mongoose.model('Menu', menuSchema);