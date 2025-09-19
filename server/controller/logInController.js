const db = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function logInPost(req, res) {
  const { userName, password } = req.body;

  const user = await db.getUser(userName);

  if (!user) {
    return res.json({ success: false, message: "user not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ success: false, message: "incorrect password" });
  }

  jwt.sign({ user: { id: user.id } }, process.env.SECRETKEY, (err, token) => {
    if (err) {
      console.error("token error in loginFunc in loginController.js", err);
      return res.json({ success: false, message: "token error" });
    }

    res.json({ success: true, message: "login succesfull", token, user });
  });
}

module.exports = {
  logInPost,
};
