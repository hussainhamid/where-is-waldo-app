const express = require("express");
const setCoordsRouter = express.Router();

const { setCoordsController } = require("../controller/setCoordsController");

setCoordsRouter.post("/", setCoordsController);

module.exports = {
  setCoordsRouter,
};
