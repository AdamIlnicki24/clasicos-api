import { Role } from "@prisma/client";
import { TeamEntity } from "../../team/entities/team.entity";
import { VisitorEntity } from "../../common/entities/visitor.entity";

export class UserEntity {
  uuid: string;
  email?: string;
  role: Role;
  visitor?: VisitorEntity;
  team?: TeamEntity;
  createdAt: Date;
  updatedAt: Date;
  bannedAt?: Date;
}
