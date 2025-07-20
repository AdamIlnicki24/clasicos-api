import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Recommendation, Role } from "@prisma/client";
import { IsBanned } from "../common/decorators/is-banned.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { User } from "../common/decorators/user.decorator";
import { UserEntity } from "../users/entities/user.entity";
import { RecommendationsService } from "./recommendations.service";

@Controller()
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Post("comments/:commentUuid/recommendations")
  async createRecommendation(
    @Param("commentUuid") commentUuid: string,
    @User() user: UserEntity,
  ): Promise<Recommendation> {
    return await this.recommendationsService.createRecommendation(commentUuid, user);
  }

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Post("comments/:commentUuid/recommendations/toggle")
  async toggleRecommendation(
    @Param("commentUuid") commentUuid: string,
    @User() user: UserEntity,
  ): Promise<{ hasRecommended: boolean; count: number }> {
    return await this.recommendationsService.toggleRecommendation(commentUuid, user);
  }

  @Get("users/:userUuid/recommendations")
  async getUserRecommendationsCount(@Param("userUuid") userUuid: string): Promise<{ count: number }> {
    const count = await this.recommendationsService.getUserRecommendationsCount(userUuid);

    return { count };
  }

  @Get("comments/:commentUuid/recommendations")
  async getCommentRecommendationsCount(@Param("commentUuid") commentUuid: string): Promise<{ count: number }> {
    const count = await this.recommendationsService.getCommentRecommendationsCount(commentUuid);

    return { count };
  }

  @Get("comments/:commentUuid/recommendations/me")
  async hasUserRecommendedComment(
    @Param("commentUuid") commentUuid: string,
    @User() user: UserEntity,
  ): Promise<{ hasRecommended: boolean }> {
    if (!user) return { hasRecommended: false };

    const count = await this.recommendationsService.countByUserAndComment(user.uuid, commentUuid);

    return { hasRecommended: count > 0 };
  }

  @Roles(Role.Admin, Role.Visitor)
  @IsBanned()
  @Delete("comments/:commentUuid/recommendations")
  async deleteRecommendation(
    @Param("commentUuid") commentUuid: string,
    @User() user: UserEntity,
  ): Promise<Recommendation> {
    return await this.recommendationsService.deleteRecommendation(commentUuid, user);
  }
}
