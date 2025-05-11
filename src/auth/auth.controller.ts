import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthEntity } from "./entities/auth.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(@Body() registerDto: RegisterDto): Promise<AuthEntity> {
    return await this.authService.createUser(registerDto);
  }
}
