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

export class CreatePanchayatRequestDto {
  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  gramname: string;

  @ApiProperty()
  anyname: string;

  @ApiProperty()
  talukaname: string;

  @ApiProperty()
  districtname: string;

  @ApiProperty()
  mobile: string;
}

export class UpdatePanchayatRequestDto extends IntersectionType(
  CreatePanchayatRequestDto,
  _IdDto,
) {}

export class PanchayatRequestQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePanchayatRequestDto),
) {}
export class AllPanchayatRequestQueryDto extends IntersectionType(
  PartialType(UpdatePanchayatRequestDto),
) {}
