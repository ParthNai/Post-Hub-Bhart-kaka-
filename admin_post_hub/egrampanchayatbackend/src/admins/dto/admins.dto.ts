import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';
import { ROLES } from '../admin.enum';

export class AdminDto {
  @ApiPropertyOptional()
  _id: string;
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiPropertyOptional()
  email: string;

  @IsMobilePhone()
  @ApiProperty()
  mobile: string;

  @ApiHideProperty()
  role: ROLES;

  @ApiHideProperty()
  password: string;

  @IsOptional()
  @ApiHideProperty()
  panchayatId: string;
}

export class CreateAdminDto extends AdminDto {}

class panchayatIdDto {
  @IsOptional()
  @ApiProperty()
  panchayatId: string;
}

export class UpdateAdminDto extends IntersectionType(AdminDto, _IdDto) {
  @ApiPropertyOptional()
  subjects: [];
}

export class AdminQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateAdminDto),
  panchayatIdDto,
) {}
