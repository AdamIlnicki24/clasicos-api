import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(127)
  email: string;

  // TODO: Add decorators to validate password
  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(63)
  nick: string;

  @IsBoolean()
  @IsOptional()
  isPrivacyPolicyAccepted?: boolean;
}
