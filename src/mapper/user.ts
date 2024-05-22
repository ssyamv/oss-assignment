import prisma from "./prisma";
import { hashPassword } from "../tools/encrypt";
import { Status } from "../types/enum";
import { RegisterInfo } from "../types/user";

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

  public static async findUserByName(name: string) {
    const user = await prisma.user.findFirst({
      where: {
        name,
      },
    });
    return user;
  }

  public static async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  public static async findUserByPhone(phone: string) {
    const user = await prisma.user.findUnique({
      where: { phone },
    });
    return user;
  }

  public static async addUser(data: RegisterInfo) {
    if ((await this.findUserByName(data.name)) !== null) {
      throw "用户名已存在";
    }
    if ((await this.findUserByPhone(data.phone)) !== null) {
      throw "手机号已存在";
    }
    return await prisma.user.create({
      data: {
        name: data.name,
        password: await hashPassword(data.password),
        phone: data.phone,
      },
    });
  }
}
