import { Context } from "koa";
import { getUserList } from "../database/user";
export default class UserController {
  public static async listUsers(ctx: Context) {
    ctx.body = await getUserList();
  }
}
