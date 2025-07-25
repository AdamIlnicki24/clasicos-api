import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { PASSWORD_REGEX } from "../../constants/regex";
import {
  EMAIL_MAX_LENGTH_EXCEPTION,
  PASSWORD_EXCEPTION,
  PASSWORD_MAX_LENGTH_EXCEPTION,
} from "../../constants/exceptions";
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from "../../constants/lengths";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(EMAIL_MAX_LENGTH, {
    message: EMAIL_MAX_LENGTH_EXCEPTION,
  })
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_EXCEPTION,
  })
  @MaxLength(PASSWORD_MAX_LENGTH, {
    message: PASSWORD_MAX_LENGTH_EXCEPTION,
  })
  password: string;
}
