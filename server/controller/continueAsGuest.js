const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function continueAsGuestController(req, res) {
  try {
    let guest = await prisma.user.findUnique({
      where: { username: "guest" },
    });

    if (!guest) {
      const hashedPassword = await bcrypt.hash(process.env.GUEST_PASSWORD, 10);

      guest = await prisma.user.create({
        data: {
          username: "guest",
          password: hashedPassword,
        },
      });
    }

    jwt.sign(
      { user: { id: guest.id } },
      process.env.SECRETKEY,
      (err, token) => {
        if (err) {
          console.error("token error in loginFunc in loginController.js", err);
          return res.json({ success: false, message: "token error" });
        }

        res.json({
          success: true,
          message: "login succesfull",
          token,
          user: guest,
        });
      }
    );
  } catch (err) {
    console.error("error in continueAsGuest controller", err);
  }
}

module.exports = { continueAsGuestController };
