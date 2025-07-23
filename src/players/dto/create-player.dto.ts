import { Position } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, Length, MaxLength } from "class-validator";
import {
  NATIONALITY_CODE_LENGTH_EXCEPTION,
  PLAYER_NAME_MAX_LENGTH_EXCEPTION,
  PLAYER_SURNAME_MAX_LENGTH_EXCEPTION,
} from "../../constants/exceptions";
import { NATIONALITY_CODE_LENGTH, PLAYER_NAME_MAX_LENGTH, PLAYER_SURNAME_MAX_LENGTH } from "../../constants/lengths";

export class CreatePlayerDto {
  @Transform(({ value }) => {
    if (typeof value !== "string") return undefined;
    const trimmedValue = value.trim();
    return trimmedValue === "" ? undefined : trimmedValue;
  })
  @IsString()
  @MaxLength(PLAYER_NAME_MAX_LENGTH, { message: PLAYER_NAME_MAX_LENGTH_EXCEPTION })
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(PLAYER_SURNAME_MAX_LENGTH, { message: PLAYER_SURNAME_MAX_LENGTH_EXCEPTION })
  surname: string;

  @IsString()
  @Length(NATIONALITY_CODE_LENGTH, NATIONALITY_CODE_LENGTH, { message: NATIONALITY_CODE_LENGTH_EXCEPTION })
  nationality: string;

  @IsEnum(Position)
  position: Position;
}
