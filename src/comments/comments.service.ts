import { Injectable, NotFoundException } from "@nestjs/common";
import { Recommendation } from "@prisma/client";
import { CommentWithCount } from "../../types/commentWithCount";
import { AuthEntity } from "../auth/entities/auth.entity";
import { COMMENT_NOT_FOUND_EXCEPTION } from "../constants/exceptions";
import { PrismaService } from "../prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(
    { content }: CreateCommentDto,
    user: AuthEntity,
    resourceFriendlyLink: string,
  ): Promise<CommentWithCount> {
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
      include: {
        _count: {
          select: { recommendations: true },
        },
      },
    });
  }

  async getCommentByUuid(uuid: string): Promise<CommentWithCount> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        uuid,
      },
      include: {
        _count: {
          select: { recommendations: true },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);
    }

    return comment;
  }

  async getComments(): Promise<CommentWithCount[]> {
    return await this.prismaService.comment.findMany({
      include: {
        _count: {
          select: { recommendations: true },
        },
      },
    });
  }

  async deleteComment(uuid: string): Promise<CommentWithCount> {
    return await this.prismaService.comment.delete({
      where: {
        uuid,
      },
      include: {
        _count: {
          select: { recommendations: true },
        },
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
