import Router from "koa-router";
import UserController from "../controllers/user";

const userRouter = new Router({ prefix: "/user" });

userRouter
  .post("/register", UserController.register)
  .get("/info", UserController.getUserInfo)
  .post("/login", UserController.login);

export default userRouter;
