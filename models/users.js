const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      const isEmail = validator.isEmail(value);

      if (!isEmail) {
        throw new Error("Email is Invalid!");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  userImage: {
    type: Buffer,
  },
});

// authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ email: user.email }, "thisissocialecom");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// login
userSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login!");
  }

  return user;
};

// Hashing the Password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("users", userSchema);
userSchema.plugin(uniqueValidator);

module.exports = User;
