import { IsOptional, IsString, MaxLength } from "class-validator";
import {
  FAVORITE_CLUB_MAX_LENGTH_EXCEPTION,
  FAVORITE_FOOTBALLER_MAX_LENGTH_EXCEPTION,
} from "../../constants/exceptions";
import { FAVORITE_CLUB_MAX_LENGTH, FAVORITE_FOOTBALLER_MAX_LENGTH } from "../../constants/lengths";

export class UpdateUserProfileDto {
  @IsString()
  @MaxLength(FAVORITE_CLUB_MAX_LENGTH, {
    message: FAVORITE_CLUB_MAX_LENGTH_EXCEPTION,
  })
  @IsOptional()
  favoriteClub?: string;

  @IsString()
  @MaxLength(FAVORITE_FOOTBALLER_MAX_LENGTH, {
    message: FAVORITE_FOOTBALLER_MAX_LENGTH_EXCEPTION,
  })
  @IsOptional()
  favoriteFootballer?: string;
}
