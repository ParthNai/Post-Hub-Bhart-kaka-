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
import { TABLEHADERTYPES } from '../enums/tableheader.enum';

export class CreateTableHeaderDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ default: TABLEHADERTYPES.TEXT })
  type: TABLEHADERTYPES;

  @IsOptional()
  @ApiPropertyOptional()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;

  @ApiProperty()
  sectionId: string;
}

export class UpdateTableHeaderDto extends IntersectionType(
  CreateTableHeaderDto,
  _IdDto,
) {}

export class TableHeaderQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateTableHeaderDto),
) {}
export class AllTableHeaderQueryDto extends IntersectionType(
  PartialType(UpdateTableHeaderDto),
) {}
