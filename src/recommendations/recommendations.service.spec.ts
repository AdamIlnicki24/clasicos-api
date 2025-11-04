import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { UserEntity } from "../users/entities/user.entity";
import { RecommendationsService } from "./recommendations.service";

type MockFn = jest.Mock;

describe("RecommendationsService", () => {
  let service: RecommendationsService;
  let prismaService: PrismaService;

  const userEntity: UserEntity = {
    uuid: "user-uuid",
    firebaseId: "fb-123",
    email: "user@example.com",
    role: Role.Visitor,
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2020-01-01T00:00:00.000Z"),
  } as UserEntity;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: PrismaService,
          useValue: {
            comment: {
              findUnique: jest.fn() as MockFn,
            },
            recommendation: {
              findUnique: jest.fn() as MockFn,
              delete: jest.fn() as MockFn,
              create: jest.fn() as MockFn,
              count: jest.fn() as MockFn,
            },
            user: {
              findUnique: jest.fn() as MockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("toggleRecommendation", () => {
    const commentUuid = "comment-uuid";

    it("should delete existing recommendation and return hasRecommended false with updated count", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue({ uuid: commentUuid });

      (prismaService.recommendation.findUnique as MockFn).mockResolvedValue({
        userUuid: userEntity.uuid,
        commentUuid,
      });

      (prismaService.recommendation.delete as MockFn).mockResolvedValue({});

      (prismaService.recommendation.count as MockFn).mockResolvedValue(5);

      const result = await service.toggleRecommendation(commentUuid, userEntity);

      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({ where: { uuid: commentUuid } });

      expect(prismaService.recommendation.findUnique).toHaveBeenCalledWith({
        where: { userUuid_commentUuid: { userUuid: userEntity.uuid, commentUuid } },
      });

      expect(prismaService.recommendation.delete).toHaveBeenCalledWith({
        where: { userUuid_commentUuid: { userUuid: userEntity.uuid, commentUuid } },
      });

      expect(prismaService.recommendation.count).toHaveBeenCalledWith({ where: { commentUuid } });

      expect(result).toEqual({ hasRecommended: false, count: 5 });
    });

    it("should create recommendation when none exists and return hasRecommended true with updated count", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue({ uuid: commentUuid });

      (prismaService.recommendation.findUnique as MockFn).mockResolvedValue(null);

      (prismaService.recommendation.create as MockFn).mockResolvedValue({
        uuid: "rec-1",
        userUuid: userEntity.uuid,
        commentUuid,
      });

      (prismaService.recommendation.count as MockFn).mockResolvedValue(7);

      const result = await service.toggleRecommendation(commentUuid, userEntity);

      expect(prismaService.recommendation.create).toHaveBeenCalledWith({
        data: {
          user: { connect: { uuid: userEntity.uuid } },
          comment: { connect: { uuid: commentUuid } },
        },
      });

      expect(prismaService.recommendation.count).toHaveBeenCalledWith({ where: { commentUuid } });

      expect(result).toEqual({ hasRecommended: true, count: 7 });
    });

    it("should throw NotFoundException when comment does not exist", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.toggleRecommendation(commentUuid, userEntity)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("should propagate errors from prisma operations", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue({ uuid: commentUuid });

      (prismaService.recommendation.findUnique as MockFn).mockRejectedValue(new Error("db fail"));

      await expect(service.toggleRecommendation(commentUuid, userEntity)).rejects.toThrow("db fail");
    });
  });

  describe("getUserRecommendationsCount", () => {
    const targetUserUuid = "target-user-uuid";

    it("returns count when user exists", async () => {
      (prismaService.user.findUnique as MockFn).mockResolvedValue({ uuid: targetUserUuid });

      (prismaService.recommendation.count as MockFn).mockResolvedValue(12);

      const result = await service.getUserRecommendationsCount(targetUserUuid);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { uuid: targetUserUuid } });

      expect(prismaService.recommendation.count).toHaveBeenCalledWith({
        where: { comment: { userUuid: targetUserUuid } },
      });

      expect(result).toBe(12);
    });

    it("throws NotFoundException when user does not exist", async () => {
      (prismaService.user.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.getUserRecommendationsCount(targetUserUuid)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("propagates errors from prisma", async () => {
      (prismaService.user.findUnique as MockFn).mockResolvedValue({ uuid: targetUserUuid });

      (prismaService.recommendation.count as MockFn).mockRejectedValue(new Error("count fail"));

      await expect(service.getUserRecommendationsCount(targetUserUuid)).rejects.toThrow("count fail");
    });
  });

  describe("getCommentRecommendationsCount", () => {
    const targetCommentUuid = "target-comment-uuid";

    it("returns count when comment exists", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue({ uuid: targetCommentUuid });

      (prismaService.recommendation.count as MockFn).mockResolvedValue(3);

      const result = await service.getCommentRecommendationsCount(targetCommentUuid);

      expect(prismaService.comment.findUnique).toHaveBeenCalledWith({ where: { uuid: targetCommentUuid } });

      expect(prismaService.recommendation.count).toHaveBeenCalledWith({ where: { commentUuid: targetCommentUuid } });

      expect(result).toBe(3);
    });

    it("throws NotFoundException when comment does not exist", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.getCommentRecommendationsCount(targetCommentUuid)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("propagates errors from prisma", async () => {
      (prismaService.comment.findUnique as MockFn).mockResolvedValue({ uuid: targetCommentUuid });

      (prismaService.recommendation.count as MockFn).mockRejectedValue(new Error("count fail"));

      await expect(service.getCommentRecommendationsCount(targetCommentUuid)).rejects.toThrow("count fail");
    });
  });

  describe("countByUserAndComment", () => {
    const targetUserUuid = "u-1";
    const targetCommentUuid = "c-1";

    it("returns recommendation count for specific user and comment", async () => {
      (prismaService.recommendation.count as MockFn).mockResolvedValue(1);

      const result = await service.countByUserAndComment(targetUserUuid, targetCommentUuid);

      expect(prismaService.recommendation.count).toHaveBeenCalledWith({
        where: { userUuid: targetUserUuid, commentUuid: targetCommentUuid },
      });

      expect(result).toBe(1);
    });

    it("propagates errors from prisma", async () => {
      (prismaService.recommendation.count as MockFn).mockRejectedValue(new Error("count fail"));

      await expect(service.countByUserAndComment(targetUserUuid, targetCommentUuid)).rejects.toThrow("count fail");
    });
  });
});
