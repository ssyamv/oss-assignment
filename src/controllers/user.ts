import { Context } from "koa";
import { ResponseCode } from "../types/enum";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  verifySchema,
} from "../joi-schemas/user";
import parameterValidate from "../tools/parameterValidate";
import {
  ForgetPasswordForm,
  LoginForm,
  RegisterForm,
  VerifyEmail,
} from "../types/user";
import UserMapper from "../mapper/user";
import { hashPassword, verifyPassword } from "../tools/encrypt";
import jwtToken from "jsonwebtoken";
import redis from "../redis";
import generateVerificationCode from "../tools/generateVerificationCode";
import sendEmail from "../tools/sendEmail";
import { logger } from "../tools/logger";
import ossManager from "../oss";

export default class UserController {
  private static secretKey = process.env.JWT_SECRET_KEY || "";
  private static emailRegisterSubject =
    process.env.EMAIL_REGISTER_SUBJECT || "";
  private static maxSendEmailCount = 50;
  public static async sendVerifyCode(ctx: Context) {
    const body = parameterValidate<VerifyEmail>(ctx.request.body, verifySchema);
    try {
      const sendCount = await redis.get(`sendCount:${body.email}`);
      if (sendCount === null)
        redis.set(`sendCount:${body.email}`, 0, "EX", 60 * 60 * 24);
      if (Number(sendCount) >= UserController.maxSendEmailCount) {
        throw "该邮箱已到达今日验证码发送上限";
      }
      const code = generateVerificationCode();
      const sendResult = await sendEmail(
        body.email,
        UserController.emailRegisterSubject,
        code
      );
      if (sendResult === true) {
        redis.set(`verifyCode:${body.email}`, code, "EX", 300);
        redis.incr(`sendCount:${body.email}`);
        return {
          message: "发送验证码成功",
        };
      } else {
        logger.error(`发送验证码失败:${sendResult}`);
        throw "发送验证码失败";
      }
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async register(ctx: Context) {
    const body = parameterValidate<RegisterForm>(
      ctx.request.body,
      registerSchema
    );
    try {
      const code = await redis.get(`verifyCode:${body.email}`);
      if (code !== body.code) throw "验证码错误";
      await UserMapper.addUser(body);
      if (await ossManager.createFolder(body.name)) {
        return { message: "注册成功" };
      } else {
        logger.error("注册失败");
        throw "注册失败";
      }
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async login(ctx: Context) {
    const body = parameterValidate<LoginForm>(ctx.request.body, loginSchema);
    try {
      const user = await UserMapper.queryUserByEmail(body.email);
      if (!user) throw "账号或密码错误";
      if (await verifyPassword(body.password, user?.password as string)) {
        const payload = { id: user?.id, role: user?.role, name: user?.name };
        const token = jwtToken.sign(payload, UserController.secretKey, {
          expiresIn: "7d",
        });
        return { data: token, message: "登录成功" };
      } else {
        throw "账号或密码错误";
      }
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async logout(ctx: Context) {
    const token = ctx.state.token;
    const decoded = jwtToken.verify(
      token,
      UserController.secretKey
    ) as jwtToken.JwtPayload;
    const expiredTime = (decoded.exp as number) - Date.now() / 1000;
    try {
      redis.set(`logout:${token}`, "1", "EX", Math.floor(expiredTime));
      return { message: "退出登录成功" };
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async forgetPassword(ctx: Context) {
    const body = parameterValidate<ForgetPasswordForm>(
      ctx.request.body,
      forgetPasswordSchema
    );
    try {
      const code = await redis.get(`verifyCode:${body.email}`);
      if (code !== body.code) throw "验证码错误";
      await UserMapper.updateUserByEmail(body.email, {
        password: await hashPassword(body.password),
      });
      return { message: "修改密码成功" };
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }

  public static async getUserInfo(ctx: Context) {
    const id = ctx.state.user.id as number;
    try {
      const user = await UserMapper.getUserInfoById(id);
      return {
        data: user,
        message: "查询用户信息成功",
      };
    } catch (error) {
      throw { code: ResponseCode.Fail, message: error };
    }
  }
}
