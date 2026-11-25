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

export class CreateImportantLinkDto {
  @ApiPropertyOptional()
  link?: string;

  @ApiHideProperty()
  image: string;

  @ApiPropertyOptional()
  external: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateImportantLinkDto extends IntersectionType(
  CreateImportantLinkDto,
  _IdDto,
) {}

export class ImportantLinkQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateImportantLinkDto),
) {}
export class AllImportantLinkQueryDto extends IntersectionType(
  PartialType(UpdateImportantLinkDto),
) {}
