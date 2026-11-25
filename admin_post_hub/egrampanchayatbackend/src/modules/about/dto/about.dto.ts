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

export class CreateAboutDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  link: string;

  @ApiPropertyOptional()
  linkTitle?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiHideProperty()
  image: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateAboutDto extends IntersectionType(CreateAboutDto, _IdDto) {}

export class AboutQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateAboutDto),
) {}
export class AllAboutQueryDto extends IntersectionType(
  PartialType(UpdateAboutDto),
) {}
