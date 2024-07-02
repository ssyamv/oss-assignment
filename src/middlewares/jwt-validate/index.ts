import koa from "koa";
import redis from "../../redis";
import { logger } from "../../tools/logger";
import { ResponseStatus } from "../../types/enum";

const jwtValidate =
  (whiteList: string[]) =>
  async (ctx: koa.Context, next: () => Promise<unknown>) => {
    ctx.state.token = ctx.header.authorization?.split(" ")[1];
    if (whiteList.includes(ctx.url)) {
      await next();
    } else {
      try {
        const isBlacklisted = await redis.exists(`logout:${ctx.state.token}`);
        if (isBlacklisted) {
          ctx.status = ResponseStatus.Unauthorized;
          ctx.message = "Login expired";
          return;
        }
        await next();
      } catch (error) {
        logger.error(`校验token失败:${error}`);
      }
    }
  };

export default jwtValidate;
