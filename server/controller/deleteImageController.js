const db = require("../db/query");
const aws = require("../config/s3Config");

async function deleteImageController(req, res) {
  const { imageUrl } = req.query;

  try {
    const imageKey = imageUrl.split(".amazonaws.com/")[1];

    await aws.deleteImageFromS3(imageKey);

    await db.deleteImageFromDb(imageUrl);

    res.json({ success: true, message: "image deleted successfully" });
  } catch (err) {
    console.error("error in deleteImageController", err);
  }
}

module.exports = { deleteImageController };
