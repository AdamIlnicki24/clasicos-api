import { Position, Role } from "@prisma/client";
import { TeamEntity } from "../../team/entities/team.entity";

export class AuthEntity {
  uuid: string;
  firebaseId: string;
  email: string;
  nick: string;
  favoriteClub?: string;
  favoriteFootballer?: string;
  role: Role;
  // TODO: Add visitor entity type below
  visitor?: {
    uuid: string;
  };
  team?: TeamEntity;
  createdAt: Date;
  updatedAt: Date;
  bannedAt?: Date;
}
