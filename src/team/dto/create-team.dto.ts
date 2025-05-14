import { IsUUID, ArrayMinSize, ArrayMaxSize } from "class-validator";

export class CreateTeamDto {
  @IsUUID("all", { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  goalkeepers: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  defenders: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  midfielders: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  forwards: string[];
}
