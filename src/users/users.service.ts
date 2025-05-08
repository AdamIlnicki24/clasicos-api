import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers() {
    return await this.prismaService.user.findMany({
      where: {
        role: {
          not: Role.Admin,
        },
      },
    });
  }

  async getUser(uuid: string) {
    return await this.prismaService.user.findUnique({
      where: { uuid },
    });
  }

  async updateUser(uuid: string, { favoriteClub, favoriteFootballer }: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: {
        uuid,
      },
      data: {
        visitor: {
          update: {
            favoriteClub,
            favoriteFootballer,
          },
        },
      },
      include: {
        visitor: true,
      },
    });
  }
}
