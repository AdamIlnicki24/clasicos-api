import { Body, Controller, Get, Param, ParseEnumPipe, Patch, Post, Query } from "@nestjs/common";
import { Player, Position, Role } from "@prisma/client";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { PlayersService } from "./players.service";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Roles(Role.Admin)
  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get()
  async getPlayers(
    @Query(
      "position",
      new ParseEnumPipe(Position, {
        optional: true,
        errorHttpStatusCode: 400,
      }),
    )
    position?: Position,
  ): Promise<Player[]> {
    return await this.playersService.getPlayers(position);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get(":uuid")
  async getPlayerByUuid(@Param("uuid") uuid: string): Promise<Player> {
    return await this.playersService.getPlayerByUuid(uuid);
  }

  @Roles(Role.Admin)
  @Patch(":uuid")
  async updatePlayer(@Param("uuid") uuid: string, @Body() updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    return await this.playersService.updatePlayer(uuid, updatePlayerDto);
  }
}
