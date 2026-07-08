import { ArrayUnique, IsIn } from "class-validator";
import { AREAS, TIPOS } from "@academic-pinpoint/shared";

export class PreferencesDto {
  @ArrayUnique()
  @IsIn(AREAS, { each: true })
  areas: string[];

  @ArrayUnique()
  @IsIn(TIPOS, { each: true })
  tipos: string[];
}
