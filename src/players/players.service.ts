import { BadRequestException, Injectable, NotFoundException, Query } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { PrismaService } from "prisma/prisma.service";
import { PLAYER_NOT_FOUND_EXCEPTION } from "src/constants/exceptions";
import { Player, Position } from "src/generated/client";

@Injectable()
export class PlayersService {
  constructor(private readonly prismaService: PrismaService) {}

  // admin endpoint
  async createPlayer(createPlayerDto: CreatePlayerDto) {
    const { name, surname, dateOfBirth, height, nationality } = createPlayerDto;

    return await this.prismaService.player.create({
      data: {
        name,
        surname,
        dateOfBirth,
        height: parseInt(height),
        nationality,
      },
    });
  }

  async getPlayers(position?: Position): Promise<Player[]> {
    const filter = position
      ? {
          teamEntries: {
            some: {
              position,
            },
          },
        }
      : {};

    return this.prismaService.player.findMany({
      where: filter,
      orderBy: { surname: "asc" },
    });
  }

  async getPlayerByUuid(uuid: string) {
    return await this.prismaService.player.findUnique({
      where: { uuid },
    });
  }

  // admin endpoint
  async updatePlayer(uuid: string, updatePlayerDto: UpdatePlayerDto) {
    const { name, surname, dateOfBirth, height, nationality } = updatePlayerDto;

    const player = await this.prismaService.player.findUnique({
      where: { uuid },
    });

    if (!player) {
      throw new NotFoundException(PLAYER_NOT_FOUND_EXCEPTION);
    }

    const updatedPlayer = await this.prismaService.player
      .update({
        where: { uuid },
        data: {
          name,
          surname,
          dateOfBirth,
          height: parseInt(height),
          nationality,
        },
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });

    return updatedPlayer;
  }

  findAll() {
    return `This action returns all players`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
