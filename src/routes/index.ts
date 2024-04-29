import Application from "koa";
import userRouter from "./user";

function routerLoader(app: Application) {
  app.use(userRouter.routes()).use(userRouter.allowedMethods());
}

export default routerLoader;
