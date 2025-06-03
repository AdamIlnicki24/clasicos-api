import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Player, Position } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { SOMETHING_WENT_WRONG_ERROR_MESSAGE } from "../constants/errorMessages";
import { EXISTING_PLAYER_EXCEPTION, PLAYER_NOT_FOUND_EXCEPTION } from "../constants/exceptions";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";

@Injectable()
export class PlayersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPlayer({ name, surname, nationality, position }: CreatePlayerDto) {
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

    return await this.prismaService.player
      .create({
        data: {
          name,
          surname,
          nationality,
          position,
        },
      })
      // TODO: Think about error handling
      .catch((error) => {
        console.error(error);
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }

  async getPlayers(position?: Position): Promise<Player[]> {
    return await this.prismaService.player.findMany({
      /**
       * When the user provides a position, the method should return only players eligible for that position.
       * If no position is provided, the method should return all players, regardless of their position.
       */
      where: position ? { position } : {},
      orderBy: { surname: "asc" },
    });
  }

  // TODO: Think about method below
  async getPlayerByUuid(uuid: string) {
    return await this.prismaService.player.findUnique({
      where: { uuid },
    });
  }

  async updatePlayer(uuid: string, { name, surname, nationality, position }: UpdatePlayerDto) {
    const player = await this.prismaService.player.findUnique({
      where: { uuid },
    });

    if (!player) {
      throw new NotFoundException(PLAYER_NOT_FOUND_EXCEPTION);
    }

    return await this.prismaService.player
      .update({
        where: { uuid },
        data: {
          name,
          surname,
          nationality,
          position,
        },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }
}
