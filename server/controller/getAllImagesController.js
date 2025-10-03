const db = require("../db/query");

async function getAllImagesController(req, res) {
  try {
    const images = await db.getAllImages();

    const imageUrl = images.map((img) => img.imageUrl);
    const imgData = images.map((img) => img.characters);

    return res.json({ success: true, imageUrl, imgData });
  } catch (err) {
    console.error("error in getAllImagesController", err);
    return res.json({ success: false, message: "cannot get images" });
  }
}

module.exports = { getAllImagesController };
