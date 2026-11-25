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

export class CreateTableSectionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;

  @ApiHideProperty()
  image: string;

  @IsOptional()
  @ApiPropertyOptional()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateTableSectionDto extends IntersectionType(
  CreateTableSectionDto,
  _IdDto,
) {}

export class TableSectionQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateTableSectionDto),
) {}
export class AllTableSectionQueryDto extends IntersectionType(
  PartialType(UpdateTableSectionDto),
) {}
