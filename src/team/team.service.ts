import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { PrismaService } from "prisma/prisma.service";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { Position, Team } from "@prisma/client";
import { EXISTING_TEAM_EXCEPTION, INVALID_TEAM_EXCEPTION } from "src/constants/exceptions";
import { DEFENDERS_LENGTH, FORWARDS_LENGTH, GOALKEEPERS_LENGTH, MIDFIELDERS_LENGTH } from "src/constants/lengths";

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMeTeam(
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

    const { Goalkeeper, Defender, Midfielder, Forward } = Position;

    const team = [
      ...goalkeepers.map((playerUuid) => ({ playerUuid, position: Goalkeeper })),
      ...defenders.map((playerUuid) => ({ playerUuid, position: Defender })),
      ...midfielders.map((playerUuid) => ({ playerUuid, position: Midfielder })),
      ...forwards.map((playerUuid) => ({ playerUuid, position: Forward })),
    ];

    return await this.prismaService.team
      .create({
        data: {
          userUuid: user.uuid,
          players: { create: team },
        },
        include: { players: { include: { player: true } } },
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
