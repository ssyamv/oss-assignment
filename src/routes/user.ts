import Router from "koa-router";
import UserController from "../controllers/user";

const userRouter = new Router({ prefix: "/user" });

userRouter
  .get("/info", UserController.getUserInfo)
  .post("/register", UserController.register)
  .post("/login", UserController.login)
  .post("/logout", UserController.logout)
  .post("/forgetPassword", UserController.forgetPassword)
  .post("/verifyCode", UserController.sendVerifyCode);

export default userRouter;
