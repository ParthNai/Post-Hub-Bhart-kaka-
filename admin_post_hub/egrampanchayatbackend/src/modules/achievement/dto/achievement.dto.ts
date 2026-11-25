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

export class CreateAchievementDto {
  @ApiProperty()
  title: string;

  // @ApiPropertyOptional()
  // linkTitle?: string;

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

export class UpdateAchievementDto extends IntersectionType(
  CreateAchievementDto,
  _IdDto,
) {}

export class AchievementQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateAchievementDto),
) {}
export class AllAchievementQueryDto extends IntersectionType(
  PartialType(UpdateAchievementDto),
) {}
