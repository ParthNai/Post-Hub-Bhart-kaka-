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

export class CreateSliderDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  link?: string;

  @ApiHideProperty()
  image: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateSliderDto extends IntersectionType(
  CreateSliderDto,
  _IdDto,
) {}

export class SliderQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateSliderDto),
) {}
export class AllSliderQueryDto extends IntersectionType(
  PartialType(UpdateSliderDto),
) {}
