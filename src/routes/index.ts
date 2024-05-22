import Application from "koa";
import userRouter from "./user";
import Router from "koa-router";
import routerResponse from "../middlewares/router-response";
import jwt from "koa-jwt";

export default function routerLoader(app: Application) {
  const openRoutes = ["/api/user/login", "/api/user/register"];
  const router = new Router({ prefix: "/api" });
  router.use(routerResponse());

  router.use(userRouter.routes());
  app.use(
    jwt({ secret: process.env.JWT_SECRET_KEY as string }).unless({
      path: openRoutes,
    })
  );
  app.use(router.allowedMethods()).use(router.routes());
}
