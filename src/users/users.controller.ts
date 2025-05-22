import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { Role, Visitor } from "@prisma/client";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { Roles } from "src/common/decorators/roles.decorator";
import { User } from "src/common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Get()
  async getUsers(): Promise<AuthEntity[]> {
    return await this.usersService.getUsers();
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get("me")
  async getMe(@User() user: AuthEntity): Promise<AuthEntity> {
    if (!user) return null;
    return await this.usersService.getUser(user.uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get(":uuid")
  async getUserByUuid(@Param("uuid") uuid: string): Promise<AuthEntity> {
    return await this.usersService.getUser(uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Patch("me")
  updateMe(@User() user: AuthEntity, @Body() updateUserDto: UpdateUserDto): Promise<AuthEntity> {
    return this.usersService.updateUser(user.uuid, updateUserDto);
  }

  @Roles(Role.Admin)
  @Patch(":uuid/ban")
  async banUser(@Param("uuid") uuid: string): Promise<Visitor> {
    return await this.usersService.banUser(uuid);
  }

  @Roles(Role.Admin)
  @Patch(":uuid/unban")
  async unbanUser(@Param("uuid") uuid: string): Promise<Visitor> {
    return await this.usersService.unbanUser(uuid);
  }
}
