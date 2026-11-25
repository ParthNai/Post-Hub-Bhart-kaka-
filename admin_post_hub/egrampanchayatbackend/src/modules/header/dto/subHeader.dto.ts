import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateSubHeaderDto {
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

  @ApiProperty()
  headerId: string;
}

export class UpdateSubHeaderDto extends IntersectionType(
  CreateSubHeaderDto,
  _IdDto,
) {}

export class SubHeaderQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateSubHeaderDto),
) {}
export class AllSubHeaderQueryDto extends IntersectionType(
  PartialType(UpdateSubHeaderDto),
) {}
