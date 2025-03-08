import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

//get users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { search, role } = req.query;

  const users = await userService.getUsersFromDB({
    search: search as string | undefined,
    role: role as string | undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: users,
  });
});

//get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getSingleUserIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user retrived successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: any, res: Response) => {
  await userService.deleteUserFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
  });
});

export const UserControllers = {
  createUser,
  getUsers,
  getSingleUser,
  deleteUser
};
