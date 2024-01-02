const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const tempusAdminSchema = new Schema({
  username: {
    type: String,
    required: [true, "please enter your username"],
    lowercase: true,
    unique: [true, "that username has been taken"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
  },
});

// (a hook a a function that fired in between two specified functions) pre-save hook to encrypt user passwords on sign up
tempusAdminSchema.pre("save", function (next) {
  // it is important in this instance to not use an arrow function and use it this way so that the word this works
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// this is a method to check hashed passwords on login

tempusAdminSchema.methods.checkPassword = function (passwordAttempt, callback) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    return callback(null, isMatch);
  });
};

tempusAdminSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

tempusAdminSchema.methods.withoutPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("tempusAdministrator", tempusAdminSchema);
