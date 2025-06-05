import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { ADMIN_CANNOT_BE_BANNED_EXCEPTION, USER_NOT_FOUND_EXCEPTION } from "../constants/exceptions";
import { PrismaService } from "../prisma.service";
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

  async getUser(uuid: string): Promise<AuthEntity> {
    return await this.prismaService.user.findUnique({
      where: {
        uuid,
      },
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

  async banUser(userUuid: string): Promise<AuthEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (!user) throw new NotFoundException(USER_NOT_FOUND_EXCEPTION);

    if (user.role === Role.Admin) {
      throw new ForbiddenException(ADMIN_CANNOT_BE_BANNED_EXCEPTION);
    }

    // TODO: Think about if statement below
    // if (!user.visitor) {
    //   throw new BadRequestException(USER_NOT_VISITOR_EXCEPTION);
    // }

    await this.prismaService.visitor.update({
      where: {
        userUuid,
      },
      data: { bannedAt: new Date() },
    });

    return user;
  }

  async unbanUser(userUuid: string): Promise<AuthEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_EXCEPTION);
    }

    // TODO: Think about if statement below
    // if (!user.visitor) {
    //   throw new BadRequestException(USER_NOT_VISITOR_EXCEPTION);
    // }

    await this.prismaService.visitor.update({
      where: { userUuid },
      data: {
        bannedAt: null,
      },
    });

    return user;
  }

  async isUserBanned(uuid: string): Promise<boolean> {
    const banned = await this.prismaService.visitor.findUnique({
      where: {
        userUuid: uuid,
      },
      select: {
        bannedAt: true,
        user: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!banned) return false;

    if (banned.user.role === Role.Admin) return false;

    return banned.bannedAt !== null;
  }
}
