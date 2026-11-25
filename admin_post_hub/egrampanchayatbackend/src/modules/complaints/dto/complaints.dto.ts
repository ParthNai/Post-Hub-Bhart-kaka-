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

export class CreateComplaintDto {
  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  complaint: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  panchayatId: string;
}

export class UpdateComplaintDto extends IntersectionType(
  CreateComplaintDto,
  _IdDto,
) {}

export class ComplaintQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateComplaintDto),
) {}
export class AllComplaintQueryDto extends IntersectionType(
  PartialType(UpdateComplaintDto),
) {}
