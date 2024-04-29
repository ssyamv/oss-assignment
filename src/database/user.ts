import prisma from ".";

export const getUserList = async () => {
  const users = await prisma.user.findMany();
  return users;
};
