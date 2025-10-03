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
  return await prisma.image.findMany({
    include: {
      characters: {
        select: {
          name: true,
          x: true,
          y: true,
        },
      },
    },
  });
}

async function deleteImageFromDb(imageUrl) {
  return await prisma.image.deleteMany({
    where: {
      imageUrl,
    },
  });
}

async function setCoords(imageUrl, x, y, charName) {
  console.log("db: ", x, y, charName);
  const img = await prisma.image.findFirst({
    where: {
      imageUrl,
    },
  });

  if (!img) {
    throw new Error("image not found");
  }

  await prisma.characters.create({
    data: {
      imageId: img.id,
      x: Number(x),
      y: Number(y),
      name: charName,
    },
  });
}

module.exports = {
  signUpUser,
  getUser,
  getAllImages,
  deleteImageFromDb,
  uploadImage,
  setCoords,
};
