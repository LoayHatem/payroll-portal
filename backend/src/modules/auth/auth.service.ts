import { prisma } from "@/db/prisma";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });
};

export const createUser = async (email: string, password: string, name: string) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
};
