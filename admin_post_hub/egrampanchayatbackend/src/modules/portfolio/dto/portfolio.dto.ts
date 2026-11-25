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

export class CreatePortfolioDto {
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

export class UpdatePortfolioDto extends IntersectionType(
  CreatePortfolioDto,
  _IdDto,
) {}

export class PortfolioQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePortfolioDto),
) {}
export class AllPortfolioQueryDto extends IntersectionType(
  PartialType(UpdatePortfolioDto),
) {}
