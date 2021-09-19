const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const config = require("../config/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //   authorization === "Bearer TOKEN"

  if (!authorization) {
    //   User has not given a auth header
    return res.status(401).send({ error: "You must be logged in!" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, config.get("jwt_secret"), async (err, payload) => {
    if (err) {
      // If error
      return res.status(401).send({ error: "You must be logged in!" });
    }

    // If there is no error
    // Get the user
    const { userId } = payload;
    
    const user = await User.findById(userId);
    
    req.user = user;

    next();
  });
};
