const User = require("../models/User");
const bcrypt = require("bcryptjs");

//check for uppercase letters
const isUpperCase = (string) => /^[A-Z]*$/.test(string);
function containsCapital(str) {
  var res = 0;
  for (let i = 0; i < str.length; i++)
    if (isUpperCase(str[i])) {
      res++;
    }
  return res;
}

const register = async (req, res) => {
  var errorlist = [];

  try {
    //Check if password contains special characters
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!format.test(req.body.password)) {
      errorlist.push("must contain a special character");
    }

    //check if passwpord less than 8 characters
    if (req.body.password.length < 8) {
      errorlist.push("must contain at least 8 letters");
    }

    //check if password contains an upper case letter
    if (!containsCapital(req.body.password)) {
      errorlist.push("must contain capital letter");
    }

    //validate name
    if (!req.body.name.length) {
      errorlist.push("name must be provided");
    }

    //check if name more than 3 characters
    if (!req.body.name.length >= 3 && !req.body.name.length <= 50) {
      errorlist.push("name must be between 3 and 50 characters");
    }

    //check if email found
    if (!req.body.email.length) {
      errorlist.push("email must be provided");
    }

    //check if email is unique
    if (await (await User.find({ email: req.body.email })).length) {
      errorlist.push("this email is registered");
    }

    if (errorlist.length) res.json({ msg: errorlist });
    else {
      //hash password
      //generate a random byte genSalt("number of rounds")=>how many rondom bytes to generate
      //the bigger the number the more secure the password
      //but the more rounds you have the more processing power is going require
      //so you have to find a balance between security and performance
      //the default is 10 rounds
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      res.status(201).json(user);
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const login = async (req, res) => {
  res.send("login user");
};

module.exports = { register, login };
