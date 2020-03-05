const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

// Creatives Schema
let creative = Schema({
    title:{
        type: String
    },
    link:{
        type: String
    },
    videolink:{
        type: String
    },
    image:{
        type: String
    }
});


let Category = module.exports = mongoose.model('Creative', creative);