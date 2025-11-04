import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { ROLES_KEY } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";

const mockCommentsService = {
  createComment: jest.fn(),
  getComments: jest.fn(),
  getCommentByUuid: jest.fn(),
  deleteComment: jest.fn(),
};

describe("CommentsController", () => {
  let controller: CommentsController;

  const user: AuthEntity = {
    uuid: "user-uuid",
    firebaseId: "fb-123",
    email: "u@example.com",
    role: Role.Visitor,
  } as AuthEntity;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Roles metadata", () => {
    it("createComment should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, CommentsController.prototype.createComment);

      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("deleteComment should have Admin role", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, CommentsController.prototype.deleteComment);

      expect(roles).toEqual([Role.Admin]);
    });
  });

  describe("Controller methods", () => {
    const resourceFriendlyLink = "article-1";

    const createDto: CreateCommentDto = { content: "hello!" };

    const comment = {
      uuid: "c1",
      content: createDto.content,
      resourceFriendlyLink,
      _count: { recommendations: 0 },
      user: { visitor: {} },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("createComment should call service.createComment", async () => {
      mockCommentsService.createComment.mockResolvedValue(comment);

      const result = await controller.createComment(createDto, user, resourceFriendlyLink);

      expect(mockCommentsService.createComment).toHaveBeenCalledWith(createDto, user, resourceFriendlyLink);

      expect(result).toBe(comment);
    });

    it("getComments should call service.getComments with param", async () => {
      const list = [comment];

      mockCommentsService.getComments.mockResolvedValue(list);

      const result = await controller.getComments(resourceFriendlyLink);

      expect(mockCommentsService.getComments).toHaveBeenCalledWith(resourceFriendlyLink, undefined);

      expect(result).toBe(list);
    });

    it("getCommentByUuid should call service.getCommentByUuid with param", async () => {
      mockCommentsService.getCommentByUuid.mockResolvedValue(comment);

      const result = await controller.getCommentByUuid(comment.uuid);

      expect(mockCommentsService.getCommentByUuid).toHaveBeenCalledWith(comment.uuid);

      expect(result).toBe(comment);
    });

    it("deleteComment should call service.deleteComment with param", async () => {
      mockCommentsService.deleteComment.mockResolvedValue(comment);

      const result = await controller.deleteComment(comment.uuid);

      expect(mockCommentsService.deleteComment).toHaveBeenCalledWith(comment.uuid);
      
      expect(result).toBe(comment);
    });
  });
});
