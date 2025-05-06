import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { Position } from "src/generated/client";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(
    @Query(
      new ParseEnumPipe(Position, {
        optional: true,
        errorHttpStatusCode: 400,
      }),
    )
    position?: Position,
  ) {
    return this.playersService.getPlayers(position);
  }

  @Get(":uuid")
  async getPlayerByUuid(@Param("uuid") uuid: string) {
    return await this.playersService.getPlayerByUuid(uuid);
  }

  @Patch(":uuid")
  async updatePlayer(@Param("uuid") uuid: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return await this.playersService.updatePlayer(uuid, updatePlayerDto);
  }
}
