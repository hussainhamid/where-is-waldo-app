const passport = require("passport");
const {
  deleteImageController,
} = require("../controller/deleteImageController");
const express = require("express");
const deleteImageRouter = express.Router();

deleteImageRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteImageController
);

module.exports = { deleteImageRouter };
