import { Position } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export class CreatePlayerDto {
  @Transform(({ value }) => {
    if (typeof value !== "string") return undefined;
    const trimmedValue = value.trim();
    return trimmedValue === "" ? undefined : trimmedValue;
  })
  @IsString()
  @MaxLength(127)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(127)
  surname: string;

  // TODO: Think about changing max length to 2
  @IsString()
  @MaxLength(127)
  nationality: string;

  @IsEnum(Position)
  position: Position;
}
