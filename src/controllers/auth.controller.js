// Require config
const config = require("../config/config");

// Import JWT
var jwt = require("jsonwebtoken");

// getting access to schema
const mongoose = require("mongoose");
const User = mongoose.model("User");

const create = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.get("jwt_secret")
    );
    return res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
};

const login = async (req, res) => {
  // User sign in router
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(422)
      .send({ error: "Must provide username and password" });
  }

  // Find a particular user with the given email
  const user = await User.findOne({ username });

  if (!user) {
    // No user found
    return res.status(404).send({ error: "Username not found" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.get("jwt_secret")
    );
    return res.send({ token });
  } catch (error) {
    return res.status(422).send({ error: "Invalid password or username" });
  }
};

// export all functions
module.exports = {
  login,
  create,
};
