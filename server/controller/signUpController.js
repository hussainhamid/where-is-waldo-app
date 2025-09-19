const db = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function signUpPost(req, res) {
  const { userName, password } = req.body;

  const existingUser = await db.getUser(userName);

  if (existingUser) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.signUpUser(userName, hashedPassword);

  jwt.sign({ user: { id: user.id } }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      return res.json({ success: false, message: "token problem" });
    }

    res.json({ success: true, message: "sign up successfully", token, user });
  });
}

module.exports = {
  signUpPost,
};
