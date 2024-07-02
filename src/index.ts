import Koa from "koa";
import routerLoader from "./routes";
import dotenv from "dotenv";
import koaBody from "koa-body";
import { initLogger, logger } from "./tools/logger";
import ossManager from "./oss";

dotenv.config();

const app = new Koa();

//初始化OSS
ossManager
  .init()
  .then(() => {
    app.use(koaBody());
    initLogger(app);
    routerLoader(app);
    app.listen(parseInt(process.env.PORT as string));
  })
  .catch((err) => {
    logger.error("启动项目失败：" + err);
  });

export default app;
