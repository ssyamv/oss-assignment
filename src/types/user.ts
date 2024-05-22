import { LoginType } from "./enum";

export interface RegisterInfo {
  name: string;
  password: string;
  phone: string;
}

export interface LoginInfo {
  name: string;
  password: string;
  type: LoginType;
}
