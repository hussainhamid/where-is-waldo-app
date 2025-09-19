const Router = require("express");
require("../config/passport");

const signUpPostRouter = Router();
const { signUpPost } = require("../controller/signUpController");
const passport = require("passport");

signUpPostRouter.post("/", signUpPost);

module.exports = {
  signUpPostRouter,
};
