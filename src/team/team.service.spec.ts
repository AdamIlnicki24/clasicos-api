import { Test, TestingModule } from "@nestjs/testing";
import { TeamService } from "./team.service";
import { PrismaService } from "../../prisma/prisma.service";
import { ConflictException, BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "../auth/entities/auth.entity";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { GOALKEEPERS_LENGTH, DEFENDERS_LENGTH, MIDFIELDERS_LENGTH, FORWARDS_LENGTH } from "../constants/lengths";

type MockFn = jest.Mock;

describe("TeamService", () => {
  let service: TeamService;
  let prismaService: PrismaService;

  const user: AuthEntity = {
    uuid: "user-uuid",
    firebaseId: "fb-123",
    email: "test@example.com",
    role: "Visitor",
  } as AuthEntity;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: PrismaService,
          useValue: {
            team: {
              findUnique: jest.fn() as MockFn,
              create: jest.fn() as MockFn,
              update: jest.fn() as MockFn,
              delete: jest.fn() as MockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("createMyTeam", () => {
    const validDto: CreateTeamDto = {
      goalkeepers: Array(GOALKEEPERS_LENGTH).fill("gk-uuid"),
      defenders: Array(DEFENDERS_LENGTH).fill("d-uuid"),
      midfielders: Array(MIDFIELDERS_LENGTH).fill("m-uuid"),
      forwards: Array(FORWARDS_LENGTH).fill("f-uuid"),
    };

    const createTeamPlayers = (dto: CreateTeamDto) => [
      ...dto.goalkeepers.map((uuid) => ({ playerUuid: uuid })),
      ...dto.defenders.map((uuid) => ({ playerUuid: uuid })),
      ...dto.midfielders.map((uuid) => ({ playerUuid: uuid })),
      ...dto.forwards.map((uuid) => ({ playerUuid: uuid })),
    ];

    it("throws ConflictException if team already exists", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue({ uuid: "t1" });

      await expect(service.createMyTeam(validDto, user)).rejects.toBeInstanceOf(ConflictException);

      expect(prismaService.team.create).not.toHaveBeenCalled();
    });

    it("throws BadRequestException if team lengths are invalid", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      const invalidDto: Partial<CreateTeamDto> = { ...validDto, defenders: ["d1"] };

      await expect(service.createMyTeam(invalidDto as CreateTeamDto, user)).rejects.toBeInstanceOf(BadRequestException);

      expect(prismaService.team.create).not.toHaveBeenCalled();
    });

    it("creates and returns team on valid input", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      const createdTeam = { uuid: "team-uuid", teamPlayers: [], userUuid: user.uuid };

      (prismaService.team.create as MockFn).mockResolvedValue(createdTeam);

      const result = await service.createMyTeam(validDto, user);

      expect(prismaService.team.create).toHaveBeenCalledWith({
        data: {
          teamPlayers: { create: createTeamPlayers(validDto) },
          user: { connect: { uuid: user.uuid } },
        },
        include: { teamPlayers: { include: { player: true } } },
      });

      expect(result).toBe(createdTeam);
    });

    it("throws BadRequestException on database error", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      (prismaService.team.create as MockFn).mockRejectedValue(new Error("DB error"));

      await expect(service.createMyTeam(validDto, user)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("getTeamByUserUuid", () => {
    it("returns null if no team found", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      const result = await service.getTeamByUserUuid(user.uuid);

      expect(result).toBeNull();
    });

    it("returns team when found", async () => {
      const team = { uuid: "t1", teamPlayers: [], userUuid: user.uuid };

      (prismaService.team.findUnique as MockFn).mockResolvedValue(team);

      const result = await service.getTeamByUserUuid(user.uuid);

      expect(prismaService.team.findUnique).toHaveBeenCalledWith({
        where: { userUuid: user.uuid },
        include: { teamPlayers: { include: { player: true } } },
      });

      expect(result).toBe(team);
    });
  });

  describe("updateMyTeam", () => {
    const validUpdate: UpdateTeamDto = {
      goalkeepers: Array(GOALKEEPERS_LENGTH).fill("gk2"),
      defenders: Array(DEFENDERS_LENGTH).fill("d2"),
      midfielders: Array(MIDFIELDERS_LENGTH).fill("m2"),
      forwards: Array(FORWARDS_LENGTH).fill("f2"),
    };

    const updateTeamPlayers = (dto: UpdateTeamDto) => [
      ...dto.goalkeepers.map((uuid) => ({ playerUuid: uuid })),
      ...dto.defenders.map((uuid) => ({ playerUuid: uuid })),
      ...dto.midfielders.map((uuid) => ({ playerUuid: uuid })),
      ...dto.forwards.map((uuid) => ({ playerUuid: uuid })),
    ];

    it("throws NotFoundException if team does not exist", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.updateMyTeam(validUpdate, user)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws BadRequestException if update lengths invalid", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue({ uuid: "t1" });

      const invalidUpdate: Partial<UpdateTeamDto> = { ...validUpdate, forwards: ["f1"] };

      await expect(service.updateMyTeam(invalidUpdate as UpdateTeamDto, user)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("updates and returns team on valid input", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue({ uuid: "t1" });

      const updatedTeam = { uuid: "t1", teamPlayers: [], userUuid: user.uuid };
      (prismaService.team.update as MockFn).mockResolvedValue(updatedTeam);

      const result = await service.updateMyTeam(validUpdate, user);

      expect(prismaService.team.update).toHaveBeenCalledWith({
        where: { uuid: "t1" },
        data: { teamPlayers: { deleteMany: {}, create: updateTeamPlayers(validUpdate) } },
        include: { teamPlayers: { include: { player: true } } },
      });

      expect(result).toBe(updatedTeam);
    });

    it("throws BadRequestException on update DB error", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue({ uuid: "t1" });

      (prismaService.team.update as MockFn).mockRejectedValue(new Error("fail"));

      await expect(service.updateMyTeam(validUpdate, user)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("deleteMyTeam", () => {
    it("throws NotFoundException if no team to delete", async () => {
      (prismaService.team.findUnique as MockFn).mockResolvedValue(null);

      await expect(service.deleteMyTeam(user)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("deletes and returns team when exists", async () => {
      const team = { uuid: "t1", teamPlayers: [], userUuid: user.uuid };

      (prismaService.team.findUnique as MockFn).mockResolvedValue(team);

      (prismaService.team.delete as MockFn).mockResolvedValue(team);

      const result = await service.deleteMyTeam(user);

      expect(prismaService.team.delete).toHaveBeenCalledWith({
        where: { uuid: "t1" },
        include: { teamPlayers: { include: { player: true } } },
      });

      expect(result).toBe(team);
    });
  });
});