import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateNewsDto {
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  website: string;

  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  @ApiProperty()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  external: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateNewsDto extends IntersectionType(CreateNewsDto, _IdDto) {}

export class NewsQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateNewsDto),
) {}
export class AllNewsQueryDto extends IntersectionType(
  PartialType(UpdateNewsDto),
) {}
