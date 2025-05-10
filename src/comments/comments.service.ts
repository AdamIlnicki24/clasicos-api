import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PrismaService } from "prisma/prisma.service";
import { AuthEntity } from "src/auth/entities/auth.entity";

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment({ content }: CreateCommentDto, user: AuthEntity, resourceFriendlyLink: string) {
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

  async getComments() {
    return await this.prismaService.comment.findMany();
  }

  async deleteComment(uuid: string) {
    return await this.prismaService.comment.delete({
      where: {
        uuid,
      },
    });
  }
}
