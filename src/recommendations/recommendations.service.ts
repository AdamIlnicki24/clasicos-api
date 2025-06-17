import { Injectable, NotFoundException } from "@nestjs/common";
import {
  COMMENT_NOT_FOUND_EXCEPTION,
  RECOMMENDATION_NOT_FOUND_EXCEPTION,
  USER_NOT_FOUND_EXCEPTION,
} from "../constants/exceptions";
import { PrismaService } from "../prisma.service";
import { UserEntity } from "../users/entities/user.entity";
import { Recommendation } from "@prisma/client";

@Injectable()
export class RecommendationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRecommendation(commentUuid: string, user: UserEntity) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        uuid: commentUuid,
      },
    });

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);

    return await this.prismaService.recommendation.create({
      data: {
        user: {
          connect: {
            uuid: user.uuid,
          },
        },
        comment: {
          connect: {
            uuid: commentUuid,
          },
        },
      },
    });
  }

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

  async deleteRecommendation(
    commentUuid: string,
    recommendationUuid: string,
    user: UserEntity,
  ): Promise<Recommendation> {
    const recommendation = await this.prismaService.recommendation.findUnique({
      where: {
        uuid: recommendationUuid,
      },
    });

    if (!recommendation) throw new NotFoundException(RECOMMENDATION_NOT_FOUND_EXCEPTION);

    return await this.prismaService.recommendation.delete({
      where: {
        userUuid_commentUuid: {
          userUuid: user.uuid,
          commentUuid,
        },
      },
    });
  }
}
