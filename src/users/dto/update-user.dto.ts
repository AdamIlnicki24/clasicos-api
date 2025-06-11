import { IsOptional, IsString, MaxLength } from "class-validator";
import { NICK_MAX_LENGTH_EXCEPTION } from "../../constants/exceptions";
import { FAVORITE_CLUB_MAX_LENGTH, FAVORITE_FOOTBALLER_MAX_LENGTH, NICK_MAX_LENGTH } from "../../constants/lengths";

export class UpdateUserDto {
  @IsString()
  @MaxLength(NICK_MAX_LENGTH, {
    message: NICK_MAX_LENGTH_EXCEPTION,
  })
  @IsOptional()
  nick?: string;

  // TODO: Add custom messages below - just like in nick field

  @IsString()
  @MaxLength(FAVORITE_CLUB_MAX_LENGTH)
  @IsOptional()
  favoriteClub?: string;

  @IsString()
  @MaxLength(FAVORITE_FOOTBALLER_MAX_LENGTH)
  @IsOptional()
  favoriteFootballer?: string;
}
