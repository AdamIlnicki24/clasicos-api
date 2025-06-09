import { Role } from "@prisma/client";
import { TeamEntity } from "../../team/entities/team.entity";
import { VisitorEntity } from "../../common/entities/visitor.entity";

export class UserEntity {
  uuid: string;
  // Email is optional because only admin can see it
  email?: string;
  role: Role;
  // Visitor is optional because it's not always needed on frontend
  visitor?: VisitorEntity;
  team?: TeamEntity;
  createdAt: Date;
  updatedAt: Date;
  bannedAt?: Date;
}
