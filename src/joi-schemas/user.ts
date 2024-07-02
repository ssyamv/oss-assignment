import joi from "joi";
import {
  ForgetPasswordForm,
  LoginForm,
  RegisterForm,
  VerifyEmail,
} from "../types/user";

export const emailSchema = joi.string().required().email().messages({
  "any.required": "邮箱不能为空",
  "string.email": "邮箱格式不正确",
});

export const simplePasswordSchema = joi.string().required().messages({
  "string.base": "密码格式不正确",
  "any.required": "密码不能为空",
});

export const codeSchema = joi.string().required().length(6).messages({
  "any.required": "验证码不能为空",
  "string.email": "验证码格式不正确",
});

export const registerSchema = joi.object<RegisterForm>().keys({
  name: joi.string().max(20).required().messages({
    "string.base": "用户名格式不正确",
    "any.required": "用户名不能为空",
    "string.max": "用户名长度不能超过20",
  }),
  password: joi.string().required().min(8).max(20).messages({
    "string.base": "密码格式不正确",
    "any.required": "密码不能为空",
    "string.max": "密码长度不能超过20",
    "string.min": "密码长度不能小于8",
  }),
  email: emailSchema,
  code: codeSchema,
});

export const loginSchema = joi.object<LoginForm>().keys({
  email: emailSchema,
  password: simplePasswordSchema,
});

export const verifySchema = joi.object<VerifyEmail>().keys({
  email: emailSchema,
});

export const forgetPasswordSchema = joi.object<ForgetPasswordForm>().keys({
  email: emailSchema,
  password: simplePasswordSchema,
  code: codeSchema,
});
