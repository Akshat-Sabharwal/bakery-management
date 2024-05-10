// DOTENV CONFIG
require("dotenv").config({
  path: __dirname + "./../.env",
});

// IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bakeryRouter = require("./routes/router");
const ServerError = require("./utils/serverError");
const { globalErrorHandler } = require("./utils/errorHandlers");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");

// INITIATION
const app = express();

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION_STRING).catch(() => {
  throw new ServerError(
    500,
    "database connection error",
    "Database connection failed!"
  );
});

// MIDDLEWARE

// Security and Sanitation
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests! Try again after sometime.",
});

app.use("/api", limiter);

// ROUTES
app.use("/bakery", bakeryRouter);

// ERROR HANDLING
app.use((err, req, res, next) => {
  globalErrorHandler(err, res);
  next();
});

// LISTENING
app.listen(process.env.PORT, (err) => {
  if (err) {
    new ServerError(500, err, "Server not listening!");
  } else {
    console.log(`Listening to port ${process.env.PORT}...`);
  }
});
