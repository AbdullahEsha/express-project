import { create } from "domain";
import User from "../models/User";
import e, { Request, Response, RequestHandler } from "express";

const getUsers: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      "Total users": users.length,
      Message: "Users fetched successfully",
      data: [
        ...users.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        }),
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};

export { getUsers };
