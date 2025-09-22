const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function deleteImageFromS3(imageKey) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Successfully deleted image from S3: ${imageKey}`);
  } catch (err) {
    console.error(`Error deleting image from S3: ${err}`);
  }
}

module.exports = { s3, deleteImageFromS3 };
