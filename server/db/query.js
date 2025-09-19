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

module.exports = {
  signUpUser,
  getUser,
};
