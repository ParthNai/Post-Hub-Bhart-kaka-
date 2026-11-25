import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateDistrictDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateDistrictDto extends IntersectionType(
  CreateDistrictDto,
  _IdDto,
) {}

export class DistrictQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateDistrictDto),
) {}
export class AllDistrictQueryDto extends IntersectionType(
  PartialType(UpdateDistrictDto),
) {}
