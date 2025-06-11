import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { Roles } from "../common/decorators/roles.decorator";
import { User } from "../common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { UserEntity } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.getUsers();
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get("me")
  async getMe(@User() user: AuthEntity): Promise<UserEntity> {
    if (!user) return null;
    return await this.usersService.getUser(user.uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get(":uuid")
  async getUserByUuid(@Param("uuid") uuid: string): Promise<UserEntity> {
    return await this.usersService.getUser(uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Patch("me")
  async updateMe(@User() user: AuthEntity, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.usersService.updateUser(user.uuid, updateUserDto);
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
