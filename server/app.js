require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
require("./config/passport");

const PORT = process.env.PORT || 3000;

require("./config/passport");

const { signUpPostRouter } = require("./router/signUpRouter");
const { logInPostRouter } = require("./router/logInRouter");
const {
  uploadPictureToCloudRouter,
} = require("./router/uploadPictureToCloudRouter");
const { getAllImagesRouter } = require("./router/getAllImagesRouter");
const { deleteImageRouter } = require("./router/deleteImageRouter");
const { setCoordsRouter } = require("./router/setCoordsRouter");

const passport = require("passport");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/sign-up", signUpPostRouter);
app.use("/log-in", logInPostRouter);
app.use("/upload", uploadPictureToCloudRouter);
app.use("/admin", getAllImagesRouter);
app.use("/delete-image", deleteImageRouter);
app.use("/set-coords", setCoordsRouter);

app.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ success: true, user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
