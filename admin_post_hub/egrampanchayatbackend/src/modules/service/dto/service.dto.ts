import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateServiceDto {
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiPropertyOptional()
  website: string;
  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateServiceDto extends IntersectionType(
  CreateServiceDto,
  _IdDto,
) {}

export class ServiceQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateServiceDto),
) {}
export class AllServiceQueryDto extends IntersectionType(
  PartialType(UpdateServiceDto),
) {}
