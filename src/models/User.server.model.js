// getting access to schema
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const TodoItem = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const TodoSchema = new mongoose.Schema({
  title: String,
  date: Date,
  items: [TodoItem],
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: {
    type: [TodoSchema],
  },
  created: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre("save", function (next) {
  // Only salt and hash its a new user
  const user = this;
  if (!user.isModified("password")) {
    // If password is already hashed
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    // Generate salt
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      // Hash the password using the salt
      if (err) {
        return next(err);
      }

      // overwrite the password with the hashed value
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  // Foreach user that is created
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      // Check if the hashed password is the same that is in the database
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

mongoose.model(`User`, userSchema);
