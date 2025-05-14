import { Body, Controller, Post } from "@nestjs/common";
import { Team } from "@prisma/client";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { User } from "src/common/decorators/user.decorator";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamService } from "./team.service";

@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post("me")
  async createMeTeam(@Body() createTeamDto: CreateTeamDto, @User() user: AuthEntity): Promise<Team> {
    return await this.teamService.createMeTeam(createTeamDto, user);
  }
}
