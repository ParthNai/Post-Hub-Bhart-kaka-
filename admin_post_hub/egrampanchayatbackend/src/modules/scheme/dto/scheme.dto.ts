import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';
import { WEBSITE } from 'src/enums';

export class CreateSchemeDto {
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  link: string;
  @IsOptional()
  @ApiPropertyOptional()
  external: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  categoryId: string;
}

export class UpdateSchemeDto extends IntersectionType(
  CreateSchemeDto,
  _IdDto,
) {}

export class SchemeQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateSchemeDto),
) {}
export class AllSchemeQueryDto extends IntersectionType(
  PartialType(UpdateSchemeDto),
) {}
