const express = require("express");
const logInPostRouter = express();

const { logInPost } = require("../controller/logInController");

logInPostRouter.post("/", logInPost);

module.exports = {
  logInPostRouter,
};
