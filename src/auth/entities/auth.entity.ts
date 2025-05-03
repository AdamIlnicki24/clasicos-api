import { Position, Role } from "generated/prisma";

export class AuthEntity {
  uuid: string;
  firebaseId: string;
  email: string;
  nick: string;
  city?: string;
  favoriteClub?: string;
  favoriteFootballer?: string;
  role: Role;
  visitor?: {
    uuid: string;
  };
  team?: {
    uuid: string;
    players?: Array<{
      playerUuid: string;
      position: Position;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
  bannedAt?: Date;
}
