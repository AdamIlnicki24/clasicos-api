import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { PASSWORD_MAX_LENGTH_EXCEPTION, PASSWORD_MIN_LENGTH_EXCEPTION } from "../../constants/exceptions";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../../constants/lengths";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(127)
  email: string;

  // TODO: Add decorators to validate password
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_EXCEPTION })
  @MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_EXCEPTION })
  password: string;

  @IsBoolean()
  isPrivacyPolicyAccepted: boolean;
}
