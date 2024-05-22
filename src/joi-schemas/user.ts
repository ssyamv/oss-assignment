import joi from "joi";
import { LoginInfo, RegisterInfo } from "../types/user";
import { LoginType } from "../types/enum";

export const registerSchema = joi.object<RegisterInfo>().keys({
  name: joi.string().max(30).required().messages({
    "string.base": "用户名格式不正确",
    "any.required": "用户名不能为空",
    "string.max": "用户名长度不能超过30",
  }),
  password: joi.string().required().min(8).max(20).messages({
    "string.base": "密码格式不正确",
    "any.required": "密码不能为空",
    "string.max": "密码长度不能超过20",
    "string.min": "密码长度不能小于8",
  }),
  phone: joi.string().required().length(11).messages({
    "string.base": "手机号格式不正确",
    "any.required": "手机号不能为空",
    "string.length": "手机号格式不正确",
  }),
});

export const loginSchema = joi.object<LoginInfo>().keys({
  name: joi.string().required().messages({
    "string.base": "用户名格式不正确",
    "any.required": "用户名不能为空",
  }),
  password: joi.string().required().messages({
    "string.base": "密码格式不正确",
    "any.required": "密码不能为空",
  }),
  type: joi
    .number()
    .required()
    .valid(...Object.values(LoginType))
    .messages({
      "any.required": "未指定登录类型",
      "any.only": "登录类型错误",
    }),
});
