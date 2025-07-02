import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Role } from "@prisma/client";
import {
  ADMIN_CANNOT_BE_BANNED_EXCEPTION,
  EXISTING_NICK_EXCEPTION,
  USER_NOT_FOUND_EXCEPTION,
} from "../constants/exceptions";
import { PrismaService } from "../prisma.service";
import { UpdateUserNickDto } from "./dto/update-user-nick.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.prismaService.user.findMany({
      where: {
        role: {
          not: Role.Admin,
        },
      },
      include: { visitor: true },
    });
  }

  async getUser(uuid: string): Promise<UserEntity> {
    return await this.prismaService.user.findUnique({
      where: {
        uuid,
      },
      include: { visitor: true },
    });
  }

  async updateUserProfile(
    uuid: string,
    { favoriteClub, favoriteFootballer }: UpdateUserProfileDto,
  ): Promise<UserEntity> {
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

  async updateUserNick(uuid: string, { nick }: UpdateUserNickDto): Promise<UserEntity> {
    const doesNickExist = await this.prismaService.visitor.findUnique({
      where: {
        nick,
      },
    });

    // TODO: Add "not" value to avoid throwing exception while changing own nick

    if (doesNickExist) throw new ConflictException(EXISTING_NICK_EXCEPTION);

    return await this.prismaService.user.update({
      where: {
        uuid,
      },
      data: {
        visitor: {
          update: {
            nick,
          },
        },
      },
      include: {
        visitor: true,
      },
    });
  }

  async banUser(userUuid: string): Promise<UserEntity> {
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

  async unbanUser(userUuid: string): Promise<UserEntity> {
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

  // TODO: Handle nick

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
