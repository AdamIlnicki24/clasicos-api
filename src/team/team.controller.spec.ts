import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { ROLES_KEY } from "../common/decorators/roles.decorator";
import { Role, Team } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { GOALKEEPERS_LENGTH, DEFENDERS_LENGTH, MIDFIELDERS_LENGTH, FORWARDS_LENGTH } from "../constants/lengths";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";

const mockTeamService = {
  createMyTeam: jest.fn(),
  getTeamByUserUuid: jest.fn(),
  updateMyTeam: jest.fn(),
  deleteMyTeam: jest.fn(),
};

describe("TeamController", () => {
  let controller: TeamController;
  const user: AuthEntity = {
    uuid: "user-uuid",
    firebaseId: "fb-123",
    email: "u@example.com",
    role: Role.Visitor,
  } as AuthEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Roles metadata", () => {
    it("createMyTeam should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, TeamController.prototype.createMyTeam);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("getMyTeam should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, TeamController.prototype.getMyTeam);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("getTeamByUserUuid should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, TeamController.prototype.getTeamByUserUuid);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("updateMyTeam should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, TeamController.prototype.updateMyTeam);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("deleteMyTeam should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, TeamController.prototype.deleteMyTeam);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });
  });

  describe("Controller methods", () => {
    const mockTeam: Team = {
      uuid: "team-uuid",
      userUuid: user.uuid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createDto = (): CreateTeamDto => ({
      goalkeepers: Array(GOALKEEPERS_LENGTH).fill("gk-uuid"),
      defenders: Array(DEFENDERS_LENGTH).fill("d-uuid"),
      midfielders: Array(MIDFIELDERS_LENGTH).fill("m-uuid"),
      forwards: Array(FORWARDS_LENGTH).fill("f-uuid"),
    });

    const updateDto = (): UpdateTeamDto => ({
      goalkeepers: Array(GOALKEEPERS_LENGTH).fill("gk2"),
      defenders: Array(DEFENDERS_LENGTH).fill("d2"),
      midfielders: Array(MIDFIELDERS_LENGTH).fill("m2"),
      forwards: Array(FORWARDS_LENGTH).fill("f2"),
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("createMyTeam should call service.createMyTeam", async () => {
      const dto = createDto();
      mockTeamService.createMyTeam.mockResolvedValue(mockTeam);

      const result = await controller.createMyTeam(dto, user);

      expect(mockTeamService.createMyTeam).toHaveBeenCalledWith(dto, user);
      expect(result).toEqual(mockTeam);
    });

    it("getMyTeam should call service.getTeamByUserUuid with current user", async () => {
      mockTeamService.getTeamByUserUuid.mockResolvedValue(mockTeam);

      const result = await controller.getMyTeam(user);

      expect(mockTeamService.getTeamByUserUuid).toHaveBeenCalledWith(user.uuid);
      expect(result).toEqual(mockTeam);
    });

    it("getTeamByUserUuid should call service.getTeamByUserUuid with param", async () => {
      const otherUuid = "other-uuid";

      mockTeamService.getTeamByUserUuid.mockResolvedValue(mockTeam);

      const result = await controller.getTeamByUserUuid(otherUuid);

      expect(mockTeamService.getTeamByUserUuid).toHaveBeenCalledWith(otherUuid);

      expect(result).toEqual(mockTeam);
    });

    it("updateMyTeam should call service.updateMyTeam", async () => {
      const dto = updateDto();
      mockTeamService.updateMyTeam.mockResolvedValue(mockTeam);

      const result = await controller.updateMyTeam(dto, user);

      expect(mockTeamService.updateMyTeam).toHaveBeenCalledWith(dto, user);
      expect(result).toEqual(mockTeam);
    });

    it("deleteMyTeam should call service.deleteMyTeam", async () => {
      mockTeamService.deleteMyTeam.mockResolvedValue(mockTeam);

      const result = await controller.deleteMyTeam(user);

      expect(mockTeamService.deleteMyTeam).toHaveBeenCalledWith(user);
      expect(result).toEqual(mockTeam);
    });
  });
});
