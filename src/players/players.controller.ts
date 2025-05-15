import { Body, Controller, Get, Param, ParseEnumPipe, Patch, Post, Query } from "@nestjs/common";
import { Player, Position } from "@prisma/client";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { PlayersService } from "./players.service";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // roles: admin
  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  // roles: visitor and admin
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

  // roles: visitor and admin
  @Get(":uuid")
  async getPlayerByUuid(@Param("uuid") uuid: string): Promise<Player> {
    return await this.playersService.getPlayerByUuid(uuid);
  }

  // roles: admin
  @Patch(":uuid")
  async updatePlayer(@Param("uuid") uuid: string, @Body() updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    return await this.playersService.updatePlayer(uuid, updatePlayerDto);
  }
}
