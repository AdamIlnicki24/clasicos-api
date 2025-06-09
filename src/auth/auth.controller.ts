import { Body, Controller, Post } from "@nestjs/common";
import { UserEntity } from "../users/entities/user.entity";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return await this.authService.createUser(registerDto);
  }
}
