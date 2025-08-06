import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { Roles } from "../common/decorators/roles.decorator";
import { User } from "../common/decorators/user.decorator";
import { UpdateUserNickDto } from "./dto/update-user-nick.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.getUsers();
  }

  @Get("me")
  async getMe(@User() user: AuthEntity): Promise<UserEntity> {
    return await this.usersService.getUser(user.uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get(":uuid")
  async getUserByUuid(@Param("uuid") uuid: string): Promise<UserEntity> {
    return await this.usersService.getUser(uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Patch("me/profile")
  async updateMyProfile(
    @User() user: AuthEntity,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserEntity> {
    return await this.usersService.updateUserProfile(user.uuid, updateUserProfileDto);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Patch("me/nick")
  async updateMyNick(@User() user: AuthEntity, @Body() updateUserNickDto: UpdateUserNickDto): Promise<UserEntity> {
    return await this.usersService.updateUserNick(user.uuid, updateUserNickDto);
  }

  @Roles(Role.Admin)
  @Patch(":uuid/ban")
  async banUser(@Param("uuid") uuid: string): Promise<UserEntity> {
    return await this.usersService.banUser(uuid);
  }

  @Roles(Role.Admin)
  @Patch(":uuid/unban")
  async unbanUser(@Param("uuid") uuid: string): Promise<UserEntity> {
    return await this.usersService.unbanUser(uuid);
  }
}
