const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   Fullname : {
    type : String,
    required : false
   },
   Email : {
      type : String,
      required : true
   },
   Address : {
      type : String,
      required : false
   },
   TelephoneNumber : {
      type : Number,
      required : false
   },
   UserType : {
    type : String,
    required : true
   },
   Gender : {
    type : String,
    required : false
   },
   Username : {
      type : String,
      required : true
   },
   Password : {
      type : String,
      required : false
   }

})

const User = mongoose.model("user",userSchema);
module.exports = User;