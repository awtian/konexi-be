const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
require("dotenv").config();

const swaggerSpecs = require("./swaggerSpecs");
const userRouter = require("./resources/user/user.router");
const postRouter = require("./resources/user/user.router");

const app = express();

mongoose.connect(process.env.MONGO_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routing

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/user", userRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: true, message: err.message });
});

module.exports = app;
