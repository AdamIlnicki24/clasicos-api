import { IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MaxLength(511)
  content: string;
}
