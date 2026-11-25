import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateFormDto {
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

export class UpdateFormDto extends IntersectionType(CreateFormDto, _IdDto) {}

export class FormQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateFormDto),
) {}
export class AllFormQueryDto extends IntersectionType(
  PartialType(UpdateFormDto),
) {}
