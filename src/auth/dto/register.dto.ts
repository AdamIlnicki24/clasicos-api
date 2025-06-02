import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { NICK_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../constants/lengths";
import { NICK_MAX_LENGTH_EXCEPTION } from "../../constants/exceptions";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(127)
  email: string;

  // TODO: Add decorators to validate password
  // TODO: Add custom messages - just like in nick field
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  password: string;

  @IsString()
  @MaxLength(NICK_MAX_LENGTH, {
    message: NICK_MAX_LENGTH_EXCEPTION,
  })
  nick: string;

  @IsBoolean()
  isPrivacyPolicyAccepted: boolean;
}
