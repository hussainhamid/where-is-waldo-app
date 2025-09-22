const db = require("../db/query");

async function getAllImagesController(req, res) {
  try {
    const images = await db.getAllImages();

    const imageUrl = images.map((img) => img.imageUrl);

    return res.json({ success: true, imageUrl });
  } catch (err) {
    console.error("error in getAllImagesController", err);
    return res.json({ success: false, message: "cannot get images" });
  }
}

module.exports = { getAllImagesController };
