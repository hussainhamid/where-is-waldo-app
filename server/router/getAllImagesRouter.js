const {
  getAllImagesController,
} = require("../controller/getAllImagesController");
const express = require("express");
const getAllImagesRouter = express.Router();
const passport = require("passport");

getAllImagesRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllImagesController
);

module.exports = { getAllImagesRouter };
