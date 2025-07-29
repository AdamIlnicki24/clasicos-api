import { Test, TestingModule } from "@nestjs/testing";
import { PlayersService } from "./players.service";
import { Position } from "@prisma/client";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

type MockFn = jest.Mock;

const mockPrismaService = {
  player: {
    findFirst: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    findMany: jest.fn() as MockFn,
    findUnique: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
  },
};

describe("PlayersService", () => {
  let service: PlayersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createPlayer", () => {
    const dto = {
      name: "Andres",
      surname: "Iniesta",
      nationality: "ES",
      position: Position.Midfielder,
    };

    it("should create a new player when none exists", async () => {
      mockPrismaService.player.findFirst.mockResolvedValue(null);
      mockPrismaService.player.create.mockResolvedValue({ ...dto, uuid: "uuid-1" });

      const result = await service.createPlayer(dto);

      expect(mockPrismaService.player.findFirst).toHaveBeenCalledWith({
        where: {
          name: dto.name,
          surname: dto.surname,
          nationality: dto.nationality,
        },
      });
      expect(mockPrismaService.player.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual({ ...dto, uuid: "uuid-1" });
    });

    it("should throw ConflictException if player already exists", async () => {
      mockPrismaService.player.findFirst.mockResolvedValue({});

      await expect(service.createPlayer(dto)).rejects.toBeInstanceOf(ConflictException);
      expect(mockPrismaService.player.create).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException on DB error during create", async () => {
      mockPrismaService.player.findFirst.mockResolvedValue(null);
      mockPrismaService.player.create.mockRejectedValue(new Error("DB error"));

      await expect(service.createPlayer(dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("getPlayers()", () => {
    const players = [
      {
        uuid: "1",
        name: null,
        surname: "Pepe",
        nationality: "PT",
        position: Position.Defender,
      },
    ];

    it("should return all players if no position filter is given", async () => {
      mockPrismaService.player.findMany.mockResolvedValue(players);

      const result = await service.getPlayers();

      expect(mockPrismaService.player.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { surname: "asc" },
      });

      expect(result).toBe(players);
    });

    it("should return only players for the given position", async () => {
      mockPrismaService.player.findMany.mockResolvedValue(players);

      const result = await service.getPlayers(Position.Defender);

      expect(mockPrismaService.player.findMany).toHaveBeenCalledWith({
        where: {
          position: Position.Defender,
        },
        orderBy: { surname: "asc" },
      });
      expect(result).toBe(players);
    });
  });

  describe("getPlayerByUuid()", () => {
    const singlePlayer = {
      uuid: "u1",
      name: "Victor",
      surname: "Valdes",
      nationality: "ES",
      position: Position.Goalkeeper,
    };

    it("should return the player if found", async () => {
      mockPrismaService.player.findUnique.mockResolvedValue(singlePlayer);

      const result = await service.getPlayerByUuid("u1");

      expect(mockPrismaService.player.findUnique).toHaveBeenCalledWith({
        where: { uuid: "u1" },
      });

      expect(result).toBe(singlePlayer);
    });

    it("should throw NotFoundException if no player with given UUID", async () => {
      mockPrismaService.player.findUnique.mockResolvedValue(null);

      await expect(service.getPlayerByUuid("missing")).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("updatePlayer()", () => {
    const updateDto = {
      name: "Updated Name",
      surname: "Updated Surname",
      nationality: "ES",
      position: Position.Forward,
    };

    const existingPlayer = { uuid: "u2", ...updateDto };

    it("should update and return the existing player", async () => {
      mockPrismaService.player.findUnique.mockResolvedValue(existingPlayer);

      mockPrismaService.player.update.mockResolvedValue(existingPlayer);

      const result = await service.updatePlayer("u2", updateDto);

      expect(mockPrismaService.player.findUnique).toHaveBeenCalledWith({
        where: { uuid: "u2" },
      });

      expect(mockPrismaService.player.update).toHaveBeenCalledWith({
        where: { uuid: "u2" },
        data: updateDto,
      });

      expect(result).toBe(existingPlayer);
    });

    it("should throw NotFoundException if player does not exist", async () => {
      mockPrismaService.player.findUnique.mockResolvedValue(null);

      await expect(service.updatePlayer("missing", updateDto)).rejects.toBeInstanceOf(NotFoundException);

      expect(mockPrismaService.player.update).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException on DB error during update", async () => {
      mockPrismaService.player.findUnique.mockResolvedValue(existingPlayer);
      mockPrismaService.player.update.mockRejectedValue(new Error("DB error"));

      await expect(service.updatePlayer("u2", updateDto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
