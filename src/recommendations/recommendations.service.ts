import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import {
  COMMENT_NOT_FOUND_EXCEPTION,
  EXISTING_RECOMMENDATION_EXCEPTION,
  RECOMMENDATION_NOT_FOUND_EXCEPTION,
  USER_NOT_FOUND_EXCEPTION,
} from "../constants/exceptions";
import { PrismaService } from "../../prisma/prisma.service";
import { UserEntity } from "../users/entities/user.entity";
import { Recommendation } from "@prisma/client";

@Injectable()
export class RecommendationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRecommendation(commentUuid: string, user: UserEntity) {
    const doesRecommendationExist = await this.prismaService.recommendation.findUnique({
      where: {
        userUuid_commentUuid: {
          userUuid: user.uuid,
          commentUuid,
        },
      },
    });

    if (doesRecommendationExist) throw new ConflictException(EXISTING_RECOMMENDATION_EXCEPTION);

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

  async toggleRecommendation(
    commentUuid: string,
    user: UserEntity,
  ): Promise<{ hasRecommended: boolean; count: number }> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        uuid: commentUuid,
      },
    });

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);

    const doesRecommendationExist = await this.prismaService.recommendation.findUnique({
      where: {
        userUuid_commentUuid: {
          userUuid: user.uuid,
          commentUuid,
        },
      },
    });

    if (doesRecommendationExist) {
      await this.prismaService.recommendation.delete({
        where: {
          userUuid_commentUuid: {
            userUuid: user.uuid,
            commentUuid,
          },
        },
      });
    } else {
      await this.prismaService.recommendation.create({
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

    const count = await this.prismaService.recommendation.count({
      where: {
        commentUuid,
      },
    });

    return {
      hasRecommended: !doesRecommendationExist,
      count,
    };
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

  async countByUserAndComment(userUuid: string, commentUuid: string): Promise<number> {
    return await this.prismaService.recommendation.count({
      where: {
        userUuid,
        commentUuid,
      },
    });
  }

  async deleteRecommendation(commentUuid: string, user: UserEntity): Promise<Recommendation> {
    const recommendation = await this.prismaService.recommendation.findUnique({
      where: {
        userUuid_commentUuid: {
          userUuid: user.uuid,
          commentUuid,
        },
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
