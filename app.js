require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var APIRouter = require("./routes/api");

const PORT = process.env.DEV_PORT || 8080;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", APIRouter);

app.listen(PORT, () => {
  console.log(`🌏 Server is running at http://localhost:${PORT}`);
});

module.exports = app;
