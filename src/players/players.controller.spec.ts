import { Test, TestingModule } from "@nestjs/testing";
import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";
import { ROLES_KEY } from "../common/decorators/roles.decorator";
import { Player, Position, Role } from "@prisma/client";

const mockPlayersService = {
  createPlayer: jest.fn(),
  getPlayers: jest.fn(),
  getPlayerByUuid: jest.fn(),
  updatePlayer: jest.fn(),
};

describe("PlayersController", () => {
  let controller: PlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Roles metadata", () => {
    it("createPlayer should have Admin role only", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, PlayersController.prototype.createPlayer);
      expect(roles).toEqual([Role.Admin]);
    });

    it("getPlayers should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, PlayersController.prototype.getPlayers);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("getPlayerByUuid should have Admin and Visitor roles", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, PlayersController.prototype.getPlayerByUuid);
      expect(roles).toEqual([Role.Admin, Role.Visitor]);
    });

    it("updatePlayer should have Admin role only", () => {
      const roles = Reflect.getMetadata(ROLES_KEY, PlayersController.prototype.updatePlayer);
      expect(roles).toEqual([Role.Admin]);
    });
  });

  describe("Controller methods", () => {
    const mockPlayer: Player = {
      uuid: "uuid-1",
      name: "Zinedine",
      surname: "Zidane",
      nationality: "FR",
      position: Position.Midfielder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("createPlayer should call service.createPlayer", async () => {
      const dto = {
        name: "Zinedine",
        surname: "Zidane",
        nationality: "FR",
        position: Position.Midfielder,
      };

      mockPlayersService.createPlayer.mockResolvedValue(mockPlayer);

      const result = await controller.createPlayer(dto);

      expect(mockPlayersService.createPlayer).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockPlayer);
    });

    it("getPlayers should call service.getPlayers without filter", async () => {
      mockPlayersService.getPlayers.mockResolvedValue([mockPlayer]);

      const result = await controller.getPlayers();
      expect(mockPlayersService.getPlayers).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockPlayer]);
    });

    it("getPlayers should call service.getPlayers with position filter", async () => {
      mockPlayersService.getPlayers.mockResolvedValue([mockPlayer]);

      const result = await controller.getPlayers(Position.Midfielder);
      expect(mockPlayersService.getPlayers).toHaveBeenCalledWith(Position.Midfielder);
      expect(result).toEqual([mockPlayer]);
    });

    it("getPlayerByUuid should call service.getPlayerByUuid", async () => {
      mockPlayersService.getPlayerByUuid.mockResolvedValue(mockPlayer);

      const result = await controller.getPlayerByUuid("uuid-1");
      expect(mockPlayersService.getPlayerByUuid).toHaveBeenCalledWith("uuid-1");
      expect(result).toEqual(mockPlayer);
    });

    it("updatePlayer should call service.updatePlayer", async () => {
      const updateDto = {
        name: "Zinedine",
        surname: "Zidane",
        nationality: "FR",
        position: Position.Midfielder,
      };

      mockPlayersService.updatePlayer.mockResolvedValue(mockPlayer);

      const result = await controller.updatePlayer("uuid-1", updateDto);
      expect(mockPlayersService.updatePlayer).toHaveBeenCalledWith("uuid-1", updateDto);
      expect(result).toEqual(mockPlayer);
    });
  });
});