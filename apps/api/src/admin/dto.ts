import { PartialType } from "@nestjs/mapped-types";
import {
  ArrayUnique,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { AREAS, MODALIDADES, TIPOS } from "@academic-pinpoint/shared";

export class CreateOpportunityDto {
  @IsIn(TIPOS)
  tipo!: string;

  @IsString()
  @MinLength(3)
  titulo!: string;

  @IsString()
  descricao!: string;

  @IsUrl()
  urlOrigem!: string;

  @IsOptional()
  @IsString()
  instituicao?: string;

  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsString()
  valorBolsa?: string;

  @IsOptional()
  @IsDateString()
  prazoInscricao?: string;

  @IsOptional()
  @IsIn(MODALIDADES)
  modalidade?: string;

  @IsOptional()
  @IsString({ each: true })
  requisitos?: string[];

  @ArrayUnique()
  @IsIn(AREAS, { each: true })
  areas!: string[];
}

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {}
