const { Schema, model } = require("mongoose");

const newUser = new Schema({
  name: {
    type: String,
    required: true,
  },
  right: {
    type: Number,
    default: 0
  },
  wrong: {
    type: Number,
    default: 0
  },

});

// Instance methods
newUser.methods.add = function(name, callback){
  return this.save(callback);
}


module.exports = model("User", newUser);
