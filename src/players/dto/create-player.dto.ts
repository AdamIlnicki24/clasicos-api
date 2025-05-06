import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MaxLength(127)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(127)
  surname: string;

  // TODO: Think about validation below
  @IsString()
  dateOfBirth: string;

  // TODO: Implement package to show then flag and country code
  @IsString()
  @MaxLength(127)
  nationality: string;

  // TODO: Convert value from dto to int
  @IsString()
  height: string;
}
