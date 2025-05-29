import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { COMMENT_NOT_FOUND_EXCEPTION } from "src/constants/exceptions";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment, Recommendation } from "@prisma/client";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment({ content }: CreateCommentDto, user: AuthEntity, resourceFriendlyLink: string): Promise<Comment> {
    return await this.prismaService.comment.create({
      data: {
        content,
        resourceFriendlyLink,
        user: {
          connect: {
            uuid: user.uuid,
          },
        },
      },
    });
  }

  async getCommentByUuid(uuid: string): Promise<Comment> {
    return await this.prismaService.comment.findUnique({
      where: {
        uuid,
      },
    });
  }

  async getComments(): Promise<(Comment & { _count: { recommendations: number } })[]> {
    return this.prismaService.comment.findMany({
      include: {
        _count: {
          select: { recommendations: true },
        },
      },
    });
  }

  async deleteComment(uuid: string): Promise<Comment> {
    return await this.prismaService.comment.delete({
      where: {
        uuid,
      },
    });
  }

  async createRecommendation(commentUuid: string, user: AuthEntity): Promise<Recommendation> {
    const comment = await this.getCommentByUuid(commentUuid);

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

  async deleteRecommendation(commentUuid: string, user: AuthEntity): Promise<Recommendation> {
    const comment = await this.getCommentByUuid(commentUuid);

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);

    return await this.prismaService.recommendation.delete({
      where: {
        userUuid_commentUuid: {
          userUuid: user.uuid,
          commentUuid,
        },
      },
    });
  }

  async getUserRecommendationsCount(user: AuthEntity): Promise<number> {
    return await this.prismaService.recommendation.count({
      where: {
        comment: {
          userUuid: user.uuid,
        },
      },
    });
  }
}
