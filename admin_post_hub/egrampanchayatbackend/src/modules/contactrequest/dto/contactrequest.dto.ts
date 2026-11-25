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

export class CreateContactRequestDto {
  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mobile: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  panchayatId: string;
}

export class UpdateContactRequestDto extends IntersectionType(
  CreateContactRequestDto,
  _IdDto,
) {}

export class ContactRequestQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateContactRequestDto),
) {}
export class AllContactRequestQueryDto extends IntersectionType(
  PartialType(UpdateContactRequestDto),
) {}
