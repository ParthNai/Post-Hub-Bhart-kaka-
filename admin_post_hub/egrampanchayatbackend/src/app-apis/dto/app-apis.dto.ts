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
  @IsOptional()
  @ApiProperty()
  name: string;

  @ApiProperty()
  subDomain: string;

  @ApiProperty()
  logoPath: string;

  @ApiHideProperty()
  isActive: boolean;

  @ApiProperty()
  taluka: string;

  @ApiProperty()
  district: string;

  @ApiPropertyOptional()
  pinCode: string;

  @IsOptional()
  @ApiProperty()
  adminName: string;

  @IsOptional()
  @ApiProperty()
  adminMobile: string;

  @IsOptional()
  @ApiProperty()
  adminEmail: string;

  @IsOptional()
  @ApiProperty()
  adminPassword: string;
}

export class UpdatePanchayatDto extends IntersectionType(
  CreatePanchayatDto,
  _IdDto,
) {}

export class PanchayatQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePanchayatDto),
) {}

export class GetTalakaQuery {
  @ApiProperty()
  districtName: string;

  @ApiProperty()
  language: string;
}
export class GetGramQuery {
  @ApiProperty()
  talukaName: string;

  @ApiProperty()
  language: string;
}
export class GetSchemeByIdQuery {
  @ApiProperty()
  schemeId: string;

  @ApiProperty()
  language: string;
}
export class GetSchemeByCategoryNameQuery {
  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  language: string;
}

export class AddSuggestionDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  language: string;
}
