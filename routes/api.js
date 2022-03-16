var express = require("express");
var router = express.Router();
const postsController = require("../controllers/controllers");

router.get("/", function (req, res, next) {
  res.render("index", { title: "HatchWay API Proxy" });
});

router.get("/ping", function (req, res, next) {
  const pingResponse = { success: true };
  res.status(200).json(pingResponse);
});

router.get("/posts", postsController());

module.exports = router;
