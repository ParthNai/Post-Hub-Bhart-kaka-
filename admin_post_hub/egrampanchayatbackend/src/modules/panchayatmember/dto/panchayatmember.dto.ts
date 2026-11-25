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

export class CreatePanchayatMemberDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  mobile: string;

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

export class UpdatePanchayatMemberDto extends IntersectionType(
  CreatePanchayatMemberDto,
  _IdDto,
) {}

export class PanchayatMemberQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePanchayatMemberDto),
) {}
export class AllPanchayatMemberQueryDto extends IntersectionType(
  PartialType(UpdatePanchayatMemberDto),
) {}
