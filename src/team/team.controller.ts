import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { Role, Team } from "@prisma/client";
import { AuthEntity } from "../auth/entities/auth.entity";
import { User } from "../common/decorators/user.decorator";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamService } from "./team.service";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Roles(Role.Admin, Role.Visitor)
  @Post("me")
  async createMyTeam(@Body() createTeamDto: CreateTeamDto, @User() user: AuthEntity): Promise<Team> {
    return await this.teamService.createMyTeam(createTeamDto, user);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get("me")
  @HttpCode(200)
  async getMyTeam(@User() user: AuthEntity): Promise<Team> {
    return await this.teamService.getTeamByUserUuid(user.uuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Get(":userUuid")
  @HttpCode(200)
  async getTeamByUserUuid(@Param("userUuid") userUuid: string): Promise<Team> {
    return await this.teamService.getTeamByUserUuid(userUuid);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Patch("me")
  async updateMyTeam(@Body() updateTeamDto: UpdateTeamDto, @User() user: AuthEntity): Promise<Team> {
    return await this.teamService.updateMyTeam(updateTeamDto, user);
  }

  @Roles(Role.Admin, Role.Visitor)
  @Delete("me")
  async deleteMyTeam(@User() user: AuthEntity): Promise<Team> {
    return await this.teamService.deleteMyTeam(user);
  }
}
