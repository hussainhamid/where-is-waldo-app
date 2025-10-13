const continueAsGuestRouter = require("express").Router();

const { continueAsGuestController } = require("../controller/continueAsGuest");

continueAsGuestRouter.post("/", continueAsGuestController);

module.exports = { continueAsGuestRouter };
