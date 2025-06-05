import { Position } from "@prisma/client";

export class TeamEntity {
  uuid: string;
  players?: {
    playerUuid: string;
    position: Position;
  }[];
}
