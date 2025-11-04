import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "@prisma/client";
import { UserEntity } from "../users/entities/user.entity";
import { RecommendationsController } from "./recommendations.controller";
import { RecommendationsService } from "./recommendations.service";

const mockRecommendationsService = {
  toggleRecommendation: jest.fn(),
  getUserRecommendationsCount: jest.fn(),
  getCommentRecommendationsCount: jest.fn(),
  countByUserAndComment: jest.fn(),
};

describe("RecommendationsController", () => {
  let controller: RecommendationsController;

  const user: UserEntity = {
    uuid: "user-uuid",
    role: Role.Visitor,
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    updatedAt: new Date("2020-01-01T00:00:00.000Z"),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        {
          provide: RecommendationsService,
          useValue: mockRecommendationsService,
        },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(RecommendationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("toggleRecommendation", () => {
    const commentUuid = "comment-1";

    it("calls service.toggleRecommendation with commentUuid and user and returns result", async () => {
      const expectedResponse = { hasRecommended: true, count: 4 };

      mockRecommendationsService.toggleRecommendation.mockResolvedValue(expectedResponse);

      const result = await controller.toggleRecommendation(commentUuid, user);

      expect(mockRecommendationsService.toggleRecommendation).toHaveBeenCalledWith(commentUuid, user);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe("getUserRecommendationsCount", () => {
    const targetUserUuid = "some-user-uuid";

    it("calls service.getUserRecommendationsCount and returns object with count", async () => {
      mockRecommendationsService.getUserRecommendationsCount.mockResolvedValue(9);

      const result = await controller.getUserRecommendationsCount(targetUserUuid);

      expect(mockRecommendationsService.getUserRecommendationsCount).toHaveBeenCalledWith(targetUserUuid);

      expect(result).toEqual({ count: 9 });
    });
  });

  describe("getCommentRecommendationsCount", () => {
    const targetCommentUuid = "some-comment-uuid";

    it("calls service.getCommentRecommendationsCount and returns object with count", async () => {
      mockRecommendationsService.getCommentRecommendationsCount.mockResolvedValue(2);

      const result = await controller.getCommentRecommendationsCount(targetCommentUuid);

      expect(mockRecommendationsService.getCommentRecommendationsCount).toHaveBeenCalledWith(targetCommentUuid);

      expect(result).toEqual({ count: 2 });
    });
  });

  describe("hasUserRecommendedComment", () => {
    const targetCommentUuid = "comment-xyz";

    it("returns { hasRecommended: false } without calling service when user is undefined", async () => {
      const result = await controller.hasUserRecommendedComment(targetCommentUuid, undefined as any);

      expect(result).toEqual({ hasRecommended: false });

      expect(mockRecommendationsService.countByUserAndComment).not.toHaveBeenCalled();
    });

    it("calls service.countByUserAndComment and returns hasRecommended true/false based on count", async () => {
      mockRecommendationsService.countByUserAndComment.mockResolvedValue(1);

      const result = await controller.hasUserRecommendedComment(targetCommentUuid, user);

      expect(mockRecommendationsService.countByUserAndComment).toHaveBeenCalledWith(user.uuid, targetCommentUuid);

      expect(result).toEqual({ hasRecommended: true });
    });
  });
});
