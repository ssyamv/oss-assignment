import { Context } from "koa";
import { LoginType, ResponseCode } from "../types/enum";
import { loginSchema, registerSchema } from "../joi-schemas/user";
import parameterValidate from "../tools/parameterValidate";
import { LoginInfo, RegisterInfo } from "../types/user";
import UserMapper from "../mapper/user";
import { verifyPassword } from "../tools/encrypt";
import jwtToken from "jsonwebtoken";
import redis from "../redis";

const secretKey = process.env.JWT_SECRET_KEY || "";

export default class UserController {
  public static async register(ctx: Context) {
    const body = parameterValidate<RegisterInfo>(
      ctx.request.body,
      registerSchema
    );
    try {
      await UserMapper.addUser(body);
      return { data: null, message: "注册成功" };
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async login(ctx: Context) {
    const body = parameterValidate<LoginInfo>(ctx.request.body, loginSchema);
    try {
      const user = await (body.type === LoginType.Name
        ? UserMapper.findUserByName(body.name)
        : UserMapper.findUserByPhone(body.name));
      if (user === null) throw "账号或密码错误";

      if (await verifyPassword(body.password, user?.password as string)) {
        const payload = { id: user?.id, role: user?.role, name: user?.name };
        const token = jwtToken.sign(payload, secretKey, { expiresIn: "7d" });
        return { data: token, message: "登录成功" };
      } else {
        return { data: null, message: "账号或密码错误" };
      }
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async logout(ctx: Context) {
    const token = ctx.header.authorization?.split(" ")[1] as string;
    const decoded = jwtToken.verify(token, secretKey) as jwtToken.JwtPayload;
    const expiredTime = (decoded.exp as number) - Date.now() / 1000;
    redis.set(`logout:${token}`, "1", "EX", expiredTime);
  }

  public static async getUserInfo(ctx: Context) {
    // const body = ctx.query;
    console.log(ctx.request.body);
  }
}
