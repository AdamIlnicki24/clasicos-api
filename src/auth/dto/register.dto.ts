import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(127)
  email: string;

  // TODO: Add decorators to validate password
  @IsString()
  @MinLength(6)
  @MaxLength(127)
  password: string;

  @IsString()
  @MaxLength(63)
  nick: string;

  @IsBoolean()
  @IsOptional()
  isPrivacyPolicyAccepted?: boolean;
}
