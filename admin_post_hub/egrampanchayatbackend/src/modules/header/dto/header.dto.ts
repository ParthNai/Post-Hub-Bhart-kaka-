import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateHeaderDto {
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

export class UpdateHeaderDto extends IntersectionType(
  CreateHeaderDto,
  _IdDto,
) {}

export class HeaderQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateHeaderDto),
) {}
export class AllHeaderQueryDto extends IntersectionType(
  PartialType(UpdateHeaderDto),
) {}
