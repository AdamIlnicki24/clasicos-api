import { Controller, Get, Param, Post } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";
import { Role, Recommendation } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { IsBanned } from "../common/decorators/is-banned.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { User } from "../common/decorators/user.decorator";

@Controller()
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Roles(Role.Admin, Role.Visitor)
    @IsBanned()
    @Post(":resourceFriendlyLink/comments/:commentUuid/recommendations")
    async createRecommendation(@Param("uuid") uuid: string, @User() user: AuthEntity): Promise<Recommendation> {
      return await this.recommendationsService.createRecommendation(uuid, user);
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
}
