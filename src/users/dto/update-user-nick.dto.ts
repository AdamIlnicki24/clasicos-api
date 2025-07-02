import { IsString, MaxLength, IsOptional } from "class-validator";
import { NICK_MAX_LENGTH_EXCEPTION } from "../../constants/exceptions";
import { NICK_MAX_LENGTH } from "../../constants/lengths";

export class UpdateUserNickDto {
  @IsString()
  @MaxLength(NICK_MAX_LENGTH, {
    message: NICK_MAX_LENGTH_EXCEPTION,
  })
  @IsOptional()
  nick?: string;
}
