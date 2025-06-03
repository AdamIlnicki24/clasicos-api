import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Comment, Recommendation, Role } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { Roles } from "../common/decorators/roles.decorator";
import { User } from "../common/decorators/user.decorator";
import { CommentWithCount } from "types/commentWithCount";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { IsBanned } from "../common/decorators/is-banned.decorator";

@Controller(":resourceFriendlyLink/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: AuthEntity,
    @Param("resourceFriendlyLink") resourceFriendlyLink: string,
  ): Promise<Comment> {
    return await this.commentsService.createComment(createCommentDto, user, resourceFriendlyLink);
  }

  @Get()
  async getComments(): Promise<CommentWithCount[]> {
    return await this.commentsService.getComments();
  }

  @Roles(Role.Admin)
  @Delete(":uuid")
  async deleteComment(@Param("uuid") uuid: string): Promise<Comment> {
    return await this.commentsService.deleteComment(uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Post(":uuid/recommendations")
  async createRecommendation(@Param("uuid") uuid: string, @User() user: AuthEntity): Promise<Recommendation> {
    return await this.commentsService.createRecommendation(uuid, user);
  }

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Delete(":uuid/recommendations")
  async deleteRecommendation(@Param("uuid") uuid: string, @User() user: AuthEntity): Promise<Recommendation> {
    return await this.commentsService.deleteRecommendation(uuid, user);
  }

  @Get(":uuid/recommendations/count")
  async getRecommendationsCount(@User() user: AuthEntity): Promise<number> {
    return await this.commentsService.getUserRecommendationsCount(user);
  }
}
