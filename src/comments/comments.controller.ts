import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { User } from "src/common/decorators/user.decorator";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller(":resourceFriendlyLink/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // roles: admin and visitor
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: AuthEntity,
    @Param("resourceFriendlyLink") resourceFriendlyLink: string,
  ) {
    return await this.commentsService.createComment(createCommentDto, user, resourceFriendlyLink);
  }

  @Get()
  async getComments() {
    return await this.commentsService.getComments();
  }

  // admin endpoint
  @Delete(":uuid")
  async deleteComment(@Param("uuid") uuid: string) {
    return await this.commentsService.deleteComment(uuid);
  }
}
