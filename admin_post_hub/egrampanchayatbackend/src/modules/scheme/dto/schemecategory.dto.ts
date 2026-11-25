import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateSchemeCategoryDto {
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateSchemeCategoryDto extends IntersectionType(
  CreateSchemeCategoryDto,
  _IdDto,
) {}

export class SchemeCategoryQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateSchemeCategoryDto),
) {}
export class AllSchemeCategoryQueryDto extends IntersectionType(
  PartialType(UpdateSchemeCategoryDto),
) {}
