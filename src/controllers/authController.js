const User = require("../models/User");
const { errorHandler } = require("../utils/errorHandlers");
const Response = require("../utils/responseUtils");
const ServerError = require("../utils/serverError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// LOCALS
const createToken = async (id) => {
  const token = await jwt.sign(id, process.env.JWT_SECRET_KEY);
  return token;
};

// EXPORTS

// PROTECT ROUTE
exports.protectRoute = errorHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new ServerError(400, "bad request", "Token not found!")
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  const tokenValid = await jwt.verify(
    token,
    process.env.JWT_SECRET_KEY
  );

  if (!tokenValid) {
    return next(new ServerError(401, "fail", "Token is invalid!"));
  }

  const user = await User.findById(tokenValid);

  if (!user) {
    return next(
      new ServerError(401, "fail", "User isn't registered!")
    );
  }

  req.user = user;

  next();
});

// SIGNUP
exports.signup = errorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  const result = await User.create({
    email: email,
    password: password,
    role: role,
  });

  const token = await createToken(result._id.toString());

  res.status(200).send({
    status: "success",
    message: "Sign up successful!",
    token: token,
    result: result,
  });
});

// LOGIN
exports.login = errorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ServerError(
        400,
        "bad request",
        "Both e-mail and password are required!"
      )
    );
  }

  let user = await User.findOne({ email: email }).select("+password");

  if (
    !user ||
    (await user.verifyPassword(password, user.password)) === false
  ) {
    return next(
      new ServerError(401, "fail", "Incorrect credentials!")
    );
  }

  const token = await createToken(user._id.toString());

  res.status(200).send({
    status: "success",
    message: "Login successful!",
    token: token,
  });
});

// FORGOT PASSWORD
exports.forgotPassword = errorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email }).select(
    "+password"
  );

  if (!user) {
    return next(new ServerError(404, "fail", "User not registered!"));
  }

  const resetToken = await user.createResetToken();
  await user.save();

  console.log(user);

  res.status(200).send({
    status: "success",
    message: "Use /reset-password to reset your password",
    passwordResetToken: resetToken,
  });
});

// RESET PASSWORD
exports.resetPassword = errorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { token } = req.params;

  if (!password || !token || !email) {
    return next(
      new ServerError(400, "fail", "Credentials or token not found!")
    );
  }

  const user = await User.findOne({ email: email }).select(
    "+password"
  );

  if (user.tokenExpires <= Date.now()) {
    return next(
      new ServerError(400, "fail", "Password reset token expired!")
    );
  }

  const result = user.checkResetToken(token);
  user.password = password;
  user.save();

  if (!result) {
    return next(
      new ServerError(400, "fail", "Invalid password reset token!")
    );
  }

  res.status(200).send({
    status: "success",
    message: "Password reset successfully!",
    result: user,
  });
});
