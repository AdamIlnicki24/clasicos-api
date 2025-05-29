import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Team } from "@prisma/client";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { User } from "src/common/decorators/user.decorator";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamService } from "./team.service";
import { UpdateTeamDto } from "./dto/update-team.dto";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post("me")
  async createMyTeam(@Body() createTeamDto: CreateTeamDto, @User() user: AuthEntity): Promise<Team> {
    return await this.teamService.createMyTeam(createTeamDto, user);
  }

  @Get("me")
  async getMyTeam(@User() user: AuthEntity): Promise<Team> {
    return await this.teamService.getTeamByUuid(user.team?.uuid);
  }

  @Get(":uuid")
  async getTeamByUuid(@Param("uuid") uuid: string): Promise<Team> {
    return await this.teamService.getTeamByUuid(uuid);
  }

  @Patch("me")
  async updateMyTeam(@Body() updateTeamDto: UpdateTeamDto, @User() user: AuthEntity): Promise<Team> {
    return await this.teamService.updateMyTeam(updateTeamDto, user);
  }

  @Delete("me")
  async deleteMyTeam(@User() user: AuthEntity): Promise<Team> {
    return await this.teamService.deleteMyTeam(user);
  }
}
