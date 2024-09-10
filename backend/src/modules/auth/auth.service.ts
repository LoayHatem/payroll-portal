import { prisma } from "@/db/prisma";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });
};

export const getUserByUserName = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
  });
};

export const getUserByEmailOrUserName = async (emailOrUsername: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: emailOrUsername,
            mode: "insensitive",
          },
        },
        {
          username: {
            equals: emailOrUsername,
            mode: "insensitive",
          },
        },
      ],
    },
  });
};

export const createUser = async (email: string, password: string) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      username: email,
    },
  });
};

export const createUserEmailToken = async (userId: string, emailToken: string, code: string) => {
  return await prisma.token.create({
    data: {
      token: emailToken,
      type: "email",
      expiry: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      userId,
      code,
    },
  });
};

export const getUserLastEmailToken = async (userId: string) => {
  return await prisma.token.findFirst({
    where: {
      userId,
      type: "email",
      consumed: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserEmailTokenByToken = async (token: string) => {
  return await prisma.token.findFirst({
    where: {
      token,
      type: "email",
      consumed: false,
      expiry: {
        gte: new Date(),
      },
    },
  });
};

export const getEmailTokenByCode = async (userId: string, code: string) => {
  return await prisma.token.findFirst({
    where: {
      code,
      userId,
      type: "email",
      consumed: false,
      expiry: {
        gte: new Date(),
      },
    },
  });
};

export const consumeEmailToken = async (tokenId: string) => {
  return await prisma.token.updateMany({
    where: {
      id: tokenId,
    },
    data: {
      consumed: true,
    },
  });
};

export const updateUserEmailVerified = async (userId: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
    },
  });
};
