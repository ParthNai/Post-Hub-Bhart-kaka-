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

export class CreateGalleryDto {
  @ApiHideProperty()
  images: string[];

  @ApiPropertyOptional()
  deletedImages?: string[];

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;

  @ApiPropertyOptional()
  panchayatId: string;
}

export class UpdateGalleryDto extends IntersectionType(
  CreateGalleryDto,
  _IdDto,
) {}

export class GalleryQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateGalleryDto),
) {}
export class AllGalleryQueryDto extends IntersectionType(
  PartialType(UpdateGalleryDto),
) {}
