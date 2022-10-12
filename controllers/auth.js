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

//regester user
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

    //
    if (errorlist.length) res.json({ msg: errorlist });
    else {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const token = user.createJWT();
      res.status(201).json({ user: { name: user.name }, token });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

//login user
const login = async (req, res) => {
  const { email, password } = req.body;
  const errorlog = [];

  //check if email found
  if (!email) {
    errorlog.push("email must be provided");
  }

  //check if password found
  if (!password) {
    errorlog.push("password must be provided");
  }

  //if email and password found
  if (email && password) {
    //check if email is registered
    const user = await User.findOne({ email });

    //if email is not registered
    if (!user) {
      errorlog.push("user not found");
    }

    //if email is registered
    if (user) {
      //check if password is correct
      const isPasswordMatch = await user.comparePassword(password);
      //if password is not correct
      if (!isPasswordMatch) {
        errorlog.push("Wrong password");
      } else {
        //if password is correct
        const token = user.createJWT(); //create token
        res.status(200).json({ user: { name: user.name }, token });
      }
    }
  }
  if (errorlog.length) {
    res.json({ msg: errorlog });
  }
};

module.exports = { register, login };
