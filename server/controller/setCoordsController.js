const db = require("../db/query");

async function setCoordsController(req, res) {
  const { imgUrl, x, y, charName } = req.body;

  try {
    await db.setCoords(imgUrl, x, y, charName);
    return res.json({ success: true, message: "coords set" });
  } catch (err) {
    console.error("error in setCoordsController", err);
    return res.json({ success: false, message: "cannot set coords" });
  }
}

module.exports = { setCoordsController };
