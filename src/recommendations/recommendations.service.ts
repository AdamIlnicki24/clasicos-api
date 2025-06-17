import { Injectable, NotFoundException } from "@nestjs/common";
import { COMMENT_NOT_FOUND_EXCEPTION, USER_NOT_FOUND_EXCEPTION } from "../constants/exceptions";
import { PrismaService } from "../prisma.service";

@Injectable()
export class RecommendationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRecommendation()

  async getUserRecommendationsCount(userUuid: string): Promise<number> {
    const doesUserExist = await this.prismaService.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (!doesUserExist) throw new NotFoundException(USER_NOT_FOUND_EXCEPTION);

    return await this.prismaService.recommendation.count({
      where: {
        comment: {
          userUuid,
        },
      },
    });
  }

  async getCommentRecommendationsCount(commentUuid: string): Promise<number> {
    const doesCommentExist = await this.prismaService.comment.findUnique({
      where: {
        uuid: commentUuid,
      },
    });

    if (!doesCommentExist) throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);

    return await this.prismaService.recommendation.count({
      where: {
        commentUuid,
      },
    });
  }
}
