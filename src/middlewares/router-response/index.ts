/* eslint-disable @typescript-eslint/no-explicit-any */
import koa from "koa";
import { ResponseCode, ResponseStatus } from "../../types/enum";

const routerResponse =
  () => async (ctx: koa.BaseContext, next: () => Promise<any>) => {
    try {
      const response = await next();
      ctx.body = {
        code: ResponseCode.Success,
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      if (error.status && error.status !== ResponseStatus.Ok) {
        ctx.status = error.status;
        ctx.message = error.message;
        return;
      }
      ctx.body = {
        code: error.code,
        message: error.message,
      };
    }
  };

export default routerResponse;
