import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreatePanchayatDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  nameInGj: string;

  @ApiProperty()
  subDomain: string;

  @ApiProperty()
  logoPath: string;

  @ApiHideProperty()
  isActive: boolean;

  @ApiProperty()
  talukaId: string;

  @ApiProperty()
  districtId: string;

  @IsOptional()
  @ApiProperty()
  adminName: string;

  @IsOptional()
  @ApiProperty()
  adminMobile: string;

  @IsOptional()
  @ApiProperty()
  adminPassword: string;
}

export class UpdatePanchayatDto extends IntersectionType(
  CreatePanchayatDto,
  _IdDto,
) {
  @IsOptional()
  @ApiPropertyOptional()
  adminNewPassword: string;
}

export class PanchayatQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePanchayatDto),
) {}
