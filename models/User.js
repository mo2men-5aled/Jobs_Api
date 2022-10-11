const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

UserSchema.pre("save", async function () {
  //hash password
  //generate a random byte genSalt("number of rounds")=>how many rondom bytes to generate
  //the bigger the number the more secure the password
  //but the more rounds you have the more processing power is going require
  //so you have to find a balance between security and performance
  //the default is 10 rounds
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
