import { IsString, MaxLength } from "class-validator";
import { COMMENT_CONTENT_MAX_LENGTH } from "../../constants/lengths";
import { COMMENT_CONTENT_MAX_LENGTH_EXCEPTION } from "../../constants/exceptions";

export class CreateCommentDto {
  @IsString()
  @MaxLength(COMMENT_CONTENT_MAX_LENGTH, { message: COMMENT_CONTENT_MAX_LENGTH_EXCEPTION })
  content: string;
}
