const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')



// User Schema
const UserSchema = mongoose.Schema({
  username:{
    type: String
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  displayname: {
    type: String
  },
  phonenumber:{
    type: String
  },
  password:{
    type: String,
    minlength: 6
  },
  role:{
    type: String,
    required: true
  },
  status:{
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  facebook:{type: String, default: ''},
  fbtokens: Array, 
  google:{type: String, default:''}

});

// UserSchema.methods.encryptPassword = function(password){
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// };

// UserSchema.methods.validUserPassword = function(password){
//   return bcrypt.compareSync(password, this.password);
// };

UserSchema.plugin(findOrCreate);



const User = module.exports = mongoose.model('User', UserSchema);
