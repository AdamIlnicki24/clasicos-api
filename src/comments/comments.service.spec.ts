import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { AuthEntity } from "../auth/entities/auth.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Role } from "@prisma/client";

type MockFn = jest.Mock;

describe("CommentsService", () => {
  let service: CommentsService;
  let prismaService: PrismaService;

  const user: AuthEntity = {
    uuid: "user-uuid",
    firebaseId: "fb-123",
    email: "test@example.com",
    role: Role.Visitor,
  } as AuthEntity;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: {
            comment: {
              create: jest.fn() as MockFn,
              findUnique: jest.fn() as MockFn,
              findMany: jest.fn() as MockFn,
              delete: jest.fn() as MockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("createComment", () => {
    const createDto: CreateCommentDto = { content: "Guti was nice!" };
    const resourceFriendlyLink = "article";

    it("calls prisma.create with correct data and returns created comment", async () => {
      const createdComment = {
        uuid: "c1",
        content: createDto.content,
        resourceFriendlyLink,
        user: {
          uuid: user.uuid,
          visitor: {},
        },
        _count: { recommendations: 0 },
      };

      (prismaService.comment.create as MockFn).mockResolvedValue(createdComment);

      const result = await service.createComment(createDto, user, resourceFriendlyLink);

      expect(prismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: createDto.content,
          resourceFriendlyLink,
          user: { connect: { uuid: user.uuid } },
        },
        include: {
          _count: { select: { recommendations: true } },
          user: { include: { visitor: true } },
        },
      });

      expect(result).toBe(createdComment);
    });

    it("propagates error when prisma.create rejects", async () => {
      (prismaService.comment.create as MockFn).mockRejectedValue(new Error("DB fail"));

      await expect(service.createComment(createDto, user, resourceFriendlyLink)).rejects.toThrow("DB fail");
    });
  });

  describe("getCommentByUuid", () => {
    const uuid = "comment-uuid";

    it("returns comment when found", async () => {
      const foundComment = {
        uuid,
        content: "I like Guti",
        _count: { recommendations: 2 },
        user: { uuid: user.uuid, visitor: {} },
      };

      (prismaService.comment.findUnique as MockFn).mockResolvedValue(foundComment);

      const result = await service.getCommentByUuid(uuid);

      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { uuid },
        include: {
          _count: { select: { recommendations: true } },
          user: { include: { visitor: true } },
        },
      });

      expect(result).toBe(foundComment);
    });

    it("throws NotFoundException when comment not found", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.getCommentByUuid(uuid)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("propagates error when prisma.findUnique rejects", async () => {
      (prismaService.comment.findUnique as MockFn).mockRejectedValue(new Error("fail"));

      await expect(service.getCommentByUuid(uuid)).rejects.toThrow("fail");
    });
  });

  describe("getComments", () => {
    const resourceFriendlyLink = "article";

    it("calls prisma.findMany with correct where/include/order and returns list", async () => {
      const list = [
        { uuid: "c1", content: "1", _count: { recommendations: 0 }, user: { visitor: {} } },
        { uuid: "c2", content: "2", _count: { recommendations: 1 }, user: { visitor: {} } },
      ];

      (prismaService.comment.findMany as MockFn).mockResolvedValue(list);

      const result = await service.getComments(resourceFriendlyLink);

      expect(prismaService.comment.findMany).toHaveBeenCalledWith({
        where: { resourceFriendlyLink },
        include: {
          _count: { select: { recommendations: true } },
          user: { include: { visitor: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      expect(result).toBe(list);
    });

    it("propagates error when prisma.findMany rejects", async () => {
      (prismaService.comment.findMany as MockFn).mockRejectedValue(new Error("db fail"));

      await expect(service.getComments(resourceFriendlyLink)).rejects.toThrow("db fail");
    });
  });

  describe("deleteComment", () => {
    const uuid = "delete-uuid";

    it("calls prisma.delete with correct where and returns deleted comment", async () => {
      const deletedComment = { uuid, content: "bye", _count: { recommendations: 0 }, user: { visitor: {} } };

      (prismaService.comment.delete as MockFn).mockResolvedValue(deletedComment);

      const result = await service.deleteComment(uuid);

      expect(prismaService.comment.delete).toHaveBeenCalledWith({
        where: { uuid },
        include: {
          _count: { select: { recommendations: true } },
          user: { include: { visitor: true } },
        },
      });

      expect(result).toBe(deletedComment);
    });

    it("propagates error when prisma.delete rejects", async () => {
      (prismaService.comment.delete as MockFn).mockRejectedValue(new Error("delete fail"));

      await expect(service.deleteComment(uuid)).rejects.toThrow("delete fail");
    });
  });
});
