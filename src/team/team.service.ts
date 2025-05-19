import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Team } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { SOMETHING_WENT_WRONG_ERROR_MESSAGE } from "src/constants/errorMessages";
import { EXISTING_TEAM_EXCEPTION, INVALID_TEAM_EXCEPTION, TEAM_NOT_FOUND_EXCEPTION } from "src/constants/exceptions";
import { DEFENDERS_LENGTH, FORWARDS_LENGTH, GOALKEEPERS_LENGTH, MIDFIELDERS_LENGTH } from "src/constants/lengths";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMyTeam(
    { goalkeepers, defenders, midfielders, forwards }: CreateTeamDto,
    user: AuthEntity,
  ): Promise<Team> {
    const exisitingTeam = await this.prismaService.team.findUnique({
      where: {
        userUuid: user.uuid,
      },
    });

    if (exisitingTeam) throw new ConflictException(EXISTING_TEAM_EXCEPTION);

    if (
      goalkeepers.length !== GOALKEEPERS_LENGTH ||
      defenders.length !== DEFENDERS_LENGTH ||
      midfielders.length !== MIDFIELDERS_LENGTH ||
      forwards.length !== FORWARDS_LENGTH
    ) {
      throw new BadRequestException(INVALID_TEAM_EXCEPTION);
    }

    const team = [
      ...goalkeepers.map((playerUuid) => ({ playerUuid })),
      ...defenders.map((playerUuid) => ({ playerUuid })),
      ...midfielders.map((playerUuid) => ({ playerUuid })),
      ...forwards.map((playerUuid) => ({ playerUuid })),
    ];

    return await this.prismaService.team
      .create({
        data: {
          teamPlayers: { create: team },
          userUuid: user.uuid,
        },
        include: { teamPlayers: { include: { player: true } } },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }

  async getTeamByUuid(uuid?: string) {
    if (!uuid) throw new NotFoundException(TEAM_NOT_FOUND_EXCEPTION);

    const team = await this.prismaService.team.findUnique({
      where: {
        uuid,
      },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!team) throw new NotFoundException(TEAM_NOT_FOUND_EXCEPTION);

    return team;
  }

  async updateMyTeam(
    { goalkeepers, defenders, midfielders, forwards }: UpdateTeamDto,
    user: AuthEntity,
  ): Promise<Team> {
    const exisitingTeam = await this.prismaService.team.findUnique({
      where: {
        userUuid: user.uuid,
      },
    });

    if (!exisitingTeam) throw new NotFoundException(TEAM_NOT_FOUND_EXCEPTION);

    if (
      goalkeepers.length !== GOALKEEPERS_LENGTH ||
      defenders.length !== DEFENDERS_LENGTH ||
      midfielders.length !== MIDFIELDERS_LENGTH ||
      forwards.length !== FORWARDS_LENGTH
    ) {
      throw new BadRequestException(INVALID_TEAM_EXCEPTION);
    }

    const team = [
      ...goalkeepers.map((playerUuid) => ({ playerUuid })),
      ...defenders.map((playerUuid) => ({ playerUuid })),
      ...midfielders.map((playerUuid) => ({ playerUuid })),
      ...forwards.map((playerUuid) => ({ playerUuid })),
    ];

    return await this.prismaService.team
      .update({
        where: {
          uuid: exisitingTeam.uuid,
        },
        data: {
          teamPlayers: {
            deleteMany: {},
            create: team,
          },
        },
        include: { teamPlayers: { include: { player: true } } },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }

  async deleteMyTeam(user: AuthEntity): Promise<Team> {
    const team = await this.prismaService.team.findUnique({
      where: {
        userUuid: user.uuid,
      },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!team) throw new NotFoundException(TEAM_NOT_FOUND_EXCEPTION);

    return await this.prismaService.team.delete({
      where: {
        uuid: team.uuid,
      },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    });
  }
}
