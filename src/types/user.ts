import { Role, Status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface RegisterForm {
  name: string;
  password: string;
  email: string;
  code: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface VerifyEmail {
  email: string;
}

export interface ForgetPasswordForm {
  email: string;
  password: string;
  code: string;
}

export interface UserInfo {
  id: number;
  name: string;
  role: Role;
  status: Status;
  email: string;
  password: string;
  totalSpace: Decimal;
  usedSpace: Decimal;
  totalTraffic: Decimal;
  usedTraffic: Decimal;
  createTime: Date;
  updateTime: Date;
}
