import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';
import { WEBSITE } from 'src/enums';
import { TABLEHADERTYPES } from '../enums/grammahiti.enum';
import { Transform } from 'class-transformer';

export class CreateGramMahitiDto {
  @ApiProperty()
  sectionId: string;

  @ApiProperty()
  headerId: string;

  @ApiProperty({ default: TABLEHADERTYPES.TEXT })
  type: TABLEHADERTYPES;

  @ApiProperty()
  value: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;

  @ApiHideProperty()
  files: Array<Express.Multer.File>;

  @ApiHideProperty()
  @IsOptional()
  @Transform((params) => JSON.parse(params.value))
  extraFields?: Record<string, string>[];

  @ApiPropertyOptional()
  position: string;
}

export class UpdateGramMahitiDto extends IntersectionType(
  CreateGramMahitiDto,
  _IdDto,
) {}

export class GramMahitiQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateGramMahitiDto),
) {}
export class AllGramMahitiQueryDto extends IntersectionType(
  PartialType(UpdateGramMahitiDto),
) {}
