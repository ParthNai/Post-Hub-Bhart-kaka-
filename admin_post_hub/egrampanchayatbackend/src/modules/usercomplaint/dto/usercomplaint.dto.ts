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

export class CreateUserComplaintDto {
  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mobile: string;

  @ApiPropertyOptional()
  complain?: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  panchayatId: string;
}

export class UpdateUserComplaintDto extends IntersectionType(
  CreateUserComplaintDto,
  _IdDto,
) {}

export class UserComplaintQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateUserComplaintDto),
) {}
export class AllUserComplaintQueryDto extends IntersectionType(
  PartialType(UpdateUserComplaintDto),
) {}
