const ServerError = require("./serverError");

// ERROR-HANDLING FUNCION WRAPPER
exports.errorHandler = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// GLOBAL ERROR HANDLER
exports.globalErrorHandler = async (err, res) => {
  // SERVER ERROR
  if (err instanceof ServerError) {
    res.status(err.statusCode).send({
      status: err.status,
      message: "Server Error",
      error: err.message,
    });
  }

  // DATABASE ERROR
  else if (err.name === "CastError") {
    res.status(400).send({
      status: "fail",
      message: "Cast Error",
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // DATA VALIDATION ERROR
  else if (err.name === "ValidationError") {
    const errorMessage = {};

    for (const field in err.errors) {
      errorMessage[field] = err.errors[field].message;
    }

    res.status(400).send({
      status: "fail",
      message: err._message,
      error: errorMessage,
    });
  }

  // DUPLICATE ERROR
  else if (err.name === "MongoServerError" && err.code === 11000) {
    res.send({
      status: "fail",
      error: err.name,
      message: `The ${Object.keys(err.keyValue)[0]} ${
        Object.values(err.keyValue)[0]
      } already exists!`,
    });
  }

  // JSON WEB TOKEN ERROR
  else if (err.name === "JsonWebTokenError") {
    res.send({
      status: "fail",
      error: err.name,
      message: "Invalid token!",
      stack: err,
    });
  }

  // DEFAULT ERROR
  else {
    console.log(err);
    res.status(500).send({
      status: "fail",
      message: "Unhandled Exception",
      error: { ...err },
    });
  }
};
