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

export class CreateUserAbhiprayDto {
  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mobile: string;

  @ApiPropertyOptional()
  abhipray?: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  panchayatId: string;
}

export class UpdateUserAbhiprayDto extends IntersectionType(
  CreateUserAbhiprayDto,
  _IdDto,
) {}

export class UserAbhiprayQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateUserAbhiprayDto),
) {}
export class AllUserAbhiprayQueryDto extends IntersectionType(
  PartialType(UpdateUserAbhiprayDto),
) {}
