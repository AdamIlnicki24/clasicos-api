import { Body, Controller, Get, Patch } from "@nestjs/common";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { User } from "src/common/decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // admin endpoint
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get("me")
  getMe(@User() user: AuthEntity) {
    if (!user) return null;
    return this.usersService.getUser(user.uuid);
  }

  @Patch("me")
  updateMe(@User() user: AuthEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.uuid, updateUserDto);
  }
}
