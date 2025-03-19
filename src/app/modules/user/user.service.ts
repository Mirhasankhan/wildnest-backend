import { User, UserRole } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../prisma/prismaClient";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, ...sanitizedUser } = user;

  return {
    accessToken,
    user: sanitizedUser,
  };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const getUsersFromDB = async ({
  search,
  role,
}: {
  search?: string;
  role?: string;
}) => {
  const users = await prisma.user.findMany({
    where: {
      AND: [
        search ? { userName: { contains: search, mode: "insensitive" } } : {},
        role ? { role: role as UserRole } : {},
      ],
    },
  });

  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }
  const sanitizedUsers = users.map(
    ({ password, ...sanitizedUser }) => sanitizedUser
  );

  return sanitizedUsers;
};

const updateUserFromDB = async (userId: string, payload: User) => {
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "User not found. Unable to update");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload,
    },
  });
  return updatedUser;
};

// const deleteUserFromDB = async (userId: string) => {
//   const existingUser = await getSingleUserIntoDB(userId);
//   if (!existingUser) {
//     throw new ApiError(404, "User not found. Unable to update status.");
//   }

//   const newStatus = existingUser.status === "ACTIVE" ? "DELETED" : "ACTIVE";

//   await prisma.user.update({
//     where: { id: userId },
//     data: { status: newStatus },
//   });

//   return;
// };

export const userService = {
  // deleteUserFromDB,
  createUserIntoDB,
  getSingleUserIntoDB,
  getUsersFromDB,
  updateUserFromDB,
};
