import { Router } from "express";
import { getUserById } from "./user.service";
import _ from "lodash";

export const userController = Router();

userController.get("/", async (req, res) => {
  const userId = req.user.id;
  const user = await getUserById(userId);
  return res.json({ user: _.omit(user, "password") });
});
