import { BadRequestException, ConflictException, Injectable, NotFoundException, Query } from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { PrismaService } from "prisma/prisma.service";
import { EXISTING_PLAYER_EXCEPTION, PLAYER_NOT_FOUND_EXCEPTION } from "src/constants/exceptions";
import { Position, Player } from "@prisma/client";

@Injectable()
export class PlayersService {
  constructor(private readonly prismaService: PrismaService) {}

  // admin endpoint
  async createPlayer({ name, surname, nationality }: CreatePlayerDto) {
    const existingPlayer = await this.prismaService.player.findFirst({
      where: {
        /**
         * If a player with the given name, surname, and nationality already exists in the database,
         * throw an exception. This exact validation is necessary because even among the best players
         * of Barcelona and Real, there have been two players with the same name and surname,
         * e.g. Luis Suarez from Uruguay and Luis Suarez from Spain.
         */
        name,
        surname,
        nationality,
      },
    });

    if (existingPlayer) throw new ConflictException(EXISTING_PLAYER_EXCEPTION);

    return await this.prismaService.player.create({
      data: {
        name,
        surname,
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
  async updatePlayer(uuid: string, { name, surname, nationality }: UpdatePlayerDto) {
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
}
