import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateFooterDto {
  @IsOptional()
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
  createdBy: string;
}

export class UpdateFooterDto extends IntersectionType(
  CreateFooterDto,
  _IdDto,
) {}

export class FooterQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateFooterDto),
) {}
export class AllFooterQueryDto extends IntersectionType(
  PartialType(UpdateFooterDto),
) {}
