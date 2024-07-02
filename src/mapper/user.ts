import prisma from "./prisma";
import { hashPassword } from "../tools/encrypt";
import { RegisterForm, UserInfo } from "../types/user";
import { Status } from "@prisma/client";

export default class UserMapper {
  public static async queryUserList() {
    return await prisma.user.findMany({
      where: {
        status: {
          not: Status.Unregister,
        },
      },
    });
  }

  public static async queryUserByName(name: string) {
    const user = await prisma.user.findFirst({
      where: {
        name,
      },
    });
    return user;
  }

  public static async queryUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  public static async queryUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  public static async addUser(data: RegisterForm) {
    if (await this.queryUserByName(data.name)) {
      throw "用户名已存在";
    }
    if (await this.queryUserByEmail(data.email)) {
      throw "邮箱已存在";
    }
    return await prisma.user.create({
      data: {
        name: data.name,
        password: await hashPassword(data.password),
        email: data.email,
      },
    });
  }

  public static async getUserInfoById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        usedSpace: true,
        usedTraffic: true,
        createTime: true,
        updateTime: true,
        totalTraffic: true,
        role: true,
        status: true,
        totalSpace: true,
      },
    });
    if (!user) throw "用户不存在";
    return user;
  }

  public static async updateUserByEmail(
    email: string,
    data: Partial<UserInfo>
  ) {
    await prisma.user.update({
      where: { email },
      data,
    });
  }
}
