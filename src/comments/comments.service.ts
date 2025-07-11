import { Injectable, NotFoundException } from "@nestjs/common";
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
        user: {
          include: {
            visitor: true,
          },
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
        user: {
          include: {
            visitor: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_EXCEPTION);
    }

    return comment;
  }

  async getComments(resourceFriendlyLink: string): Promise<CommentWithCount[]> {
    return await this.prismaService.comment.findMany({
      where: { resourceFriendlyLink },
      include: {
        _count: {
          select: { recommendations: true },
        },
        user: {
          include: {
            visitor: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
        user: {
          include: {
            visitor: true,
          },
        },
      },
    });
  }
}
