import { IsUUID, ArrayMinSize, ArrayMaxSize } from "class-validator";
import { DEFENDERS_LENGTH, FORWARDS_LENGTH, GOALKEEPERS_LENGTH, MIDFIELDERS_LENGTH } from "src/constants/lengths";

export class CreateTeamDto {
  @IsUUID("all", { each: true })
  @ArrayMinSize(GOALKEEPERS_LENGTH)
  @ArrayMaxSize(GOALKEEPERS_LENGTH)
  goalkeepers: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(DEFENDERS_LENGTH)
  @ArrayMaxSize(DEFENDERS_LENGTH)
  defenders: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(MIDFIELDERS_LENGTH)
  @ArrayMaxSize(MIDFIELDERS_LENGTH)
  midfielders: string[];

  @IsUUID("all", { each: true })
  @ArrayMinSize(FORWARDS_LENGTH)
  @ArrayMaxSize(FORWARDS_LENGTH)
  forwards: string[];
}
