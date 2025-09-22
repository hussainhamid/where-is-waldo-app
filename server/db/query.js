const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function signUpUser(username, password) {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
}

async function getUser(username) {
  return await prisma.user.findFirst({
    where: {
      username,
    },
  });
}

async function uploadImage(imageUrl) {
  await prisma.image.create({
    data: {
      imageUrl,
    },
  });
}

async function getAllImages() {
  return await prisma.image.findMany({});
}

async function deleteImageFromDb(imageUrl) {
  return await prisma.image.deleteMany({
    where: {
      imageUrl,
    },
  });
}

module.exports = {
  signUpUser,
  getUser,
  getAllImages,
  deleteImageFromDb,
  uploadImage,
};
