const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// SCHEMA
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "A user must have an e-mail!"],
      validate: [validator.isEmail, "The e-mail is invalid!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have an password!"],
    },
    role: {
      type: String,
      enum: ["customer", "manager", "admin"],
      default: "customer",
    },
    createdAt: {
      type: Date,
    },
    passwordResetToken: String,
    tokenExpires: Date,
  },
  {
    collection: "users",
  }
);

// METHODS
userSchema.methods.verifyPassword = async function (
  candidatePass,
  knownPass
) {
  await bcrypt.compare(candidatePass, knownPass).then((val) => {
    return val;
  });
};

userSchema.methods.createResetToken = async function () {
  const token = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetToken = hashedToken;
  this.tokenExpires =
    Date.now() + process.env.JWT_EXPIRES_IN * 60 * 1000;

  return token;
};

userSchema.methods.checkResetToken = async function (token) {
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  if (encryptedToken !== this.passwordResetToken) {
    return false;
  }

  this.passwordResetToken = undefined;
  this.tokenExpires = undefined;

  return true;
};

// DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 13);
  }

  this.modifiedAt = Date.now();
  next();
});

// QUERY MIDDLEWARE
userSchema.pre("find", async function () {
  this.select("-__v");
});

const User = mongoose.model("User", userSchema);

module.exports = User;
