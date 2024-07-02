/* eslint-disable @typescript-eslint/no-explicit-any */
import koa from "koa";
import { ResponseCode, ResponseStatus } from "../../types/enum";
import { logger } from "../../tools/logger";

const routerResponse =
  () => async (ctx: koa.BaseContext, next: () => Promise<any>) => {
    try {
      const startTime = Date.now();
      const response = await next();
      ctx.body = {
        code: ResponseCode.Success,
        data: response.data ? response.data : null,
        message: response.message,
      };
      const responseTime = Date.now() - startTime;
      logger.info(
        `Response:${JSON.stringify(ctx.body)},Response Time:${responseTime}ms`
      );
    } catch (error: any) {
      if (error.status && error.status !== ResponseStatus.Ok) {
        ctx.status = error.status;
        ctx.message = error.message;
        logger.error(`error:${ctx.status} ${ctx.message}`);
        return;
      }
      ctx.body = {
        code: error.code,
        message: error.message,
      };
      logger.error(`error:${JSON.stringify(ctx.body)}`);
    }
  };

export default routerResponse;
