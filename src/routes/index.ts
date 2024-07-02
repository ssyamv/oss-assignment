import Application from "koa";
import userRouter from "./user";
import Router from "koa-router";
import routerResponse from "../middlewares/router-response";
import jwt from "koa-jwt";
import jwtValidate from "../middlewares/jwt-validate";

const openRoutes = [
  "/api/user/login",
  "/api/user/register",
  "/api/user/verifyCode",
  "/api/user/forgetPassword",
];

export default function routerLoader(app: Application) {
  const router = new Router({ prefix: "/api" });
  router
    .use(jwtValidate(openRoutes))
    .use(routerResponse())
    .use(userRouter.routes());

  app
    .use(
      jwt({ secret: process.env.JWT_SECRET_KEY as string }).unless({
        path: openRoutes,
      })
    )
    .use(router.allowedMethods())
    .use(router.routes());
}
