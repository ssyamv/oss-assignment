import Router from "koa-router";
import UserController from "../controllers/user";

const userRouter = new Router();

userRouter.get("/users", UserController.listUsers);

export default userRouter;
