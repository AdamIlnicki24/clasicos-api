import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @MaxLength(127)
  @IsOptional()
  favoriteClub?: string;

  @IsString()
  @MaxLength(127)
  @IsOptional()
  favoriteFootballer?: string;
}
