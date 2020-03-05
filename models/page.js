const mongoose          = require('mongoose');
const AutoIncrement     = require('mongoose-sequence')(mongoose);
const Schema            = mongoose.Schema;

let pageSchema = Schema({
    pagetype: {
        type: String
    },
    pageid: {
        type: Number
    },
    title: {
        type: String
    },
    layout: {
        type: String
    },
    continent: {
        type: []
    },
    pagecontent: {
        type: Object
    }
});

pageSchema.plugin(AutoIncrement, {inc_field: 'pageid'});
let Page = module.exports = mongoose.model('Page', pageSchema);









//Old code 
// const mongoose          = require('mongoose');
// const AutoIncrement     = require('mongoose-sequence')(mongoose);
// const Schema            = mongoose.Schema;

// let pageSchema = Schema({
//     pagetype: {
//         type: String
//     },
//     pageid: {
//         type: Number
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     common: {
//         type: String
//     },
//     layout: {
//         type: String
//     },
//     country: {
//         type: String
//     },
//     pagecontent: {
//         type: Object
//     }
// });

// pageSchema.plugin(AutoIncrement, {inc_field: 'pageid'});
// let Page = module.exports = mongoose.model('Page', pageSchema);