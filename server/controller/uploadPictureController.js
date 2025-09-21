const passport = require("passport");
const db = require("../db/query");

async function uploadPictureToCloudPost(req, res) {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "no file uploaded" });
    }

    const imageUrl = req.file.location;

    await db.uploadImage(imageUrl);

    return res.json({
      success: true,
      message: "image uploaded successfully",
      fileUrl: imageUrl,
    });
  } catch (err) {
    console.error("error in uploadPictureToCloudPost", err);
    return res.json({ success: false, message: "server error" });
  }
}

module.exports = { uploadPictureToCloudPost };
