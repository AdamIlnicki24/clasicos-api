import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PlayersService } from "./players.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playersService.createPlayer(createPlayerDto);
  }

  @Get()
  async getPlayers() {
    return await this.playersService.getPlayers();
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
