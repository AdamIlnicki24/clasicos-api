import { Body, Controller, Get, Patch } from "@nestjs/common";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { User } from "src/common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // roles: admin
  @Get()
  async getUsers(): Promise<AuthEntity[]> {
    return await this.usersService.getUsers();
  }

  // roles: admin and visitor
  @Get("me")
  async getMe(@User() user: AuthEntity): Promise<AuthEntity> {
    if (!user) return null;
    return await this.usersService.getUser(user.uuid);
  }

  // roles: admin and visitor
  @Patch("me")
  updateMe(@User() user: AuthEntity, @Body() updateUserDto: UpdateUserDto): Promise<AuthEntity> {
    return this.usersService.updateUser(user.uuid, updateUserDto);
  }
}
