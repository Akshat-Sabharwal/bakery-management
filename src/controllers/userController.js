const User = require("../models/User");
const { errorHandler } = require("../utils/errorHandlers");

exports.getAllUsers = errorHandler(async (req, res, next) => {
  const users = await User.find().select("-__v -_id");

  res.status(200).send({
    status: "success",
    message: "Users fetched!",
    results: users.length,
    users: [...users],
  });
});

// exports.updateUser = errorHandler(async (req, res, next) => {
//   const result = User.updateOne({ email: email });
// });
