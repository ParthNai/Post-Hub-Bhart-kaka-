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

export class CreateAbhiprayDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  occupation: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiHideProperty()
  image: string;

  @IsOptional()
  @ApiPropertyOptional()
  position: number;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateAbhiprayDto extends IntersectionType(
  CreateAbhiprayDto,
  _IdDto,
) {}

export class AbhiprayQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateAbhiprayDto),
) {}
export class AllAbhiprayQueryDto extends IntersectionType(
  PartialType(UpdateAbhiprayDto),
) {}
