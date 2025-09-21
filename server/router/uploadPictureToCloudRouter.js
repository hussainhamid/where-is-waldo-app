const {
  uploadPictureToCloudPost,
} = require("../controller/uploadPictureController");
const express = require("express");
require("../config/passport");
const passport = require("passport");
const upload = require("../config/multer");
const uploadPictureToCloudRouter = express();

uploadPictureToCloudRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("uploadedImage"),
  uploadPictureToCloudPost
);

module.exports = { uploadPictureToCloudRouter };
