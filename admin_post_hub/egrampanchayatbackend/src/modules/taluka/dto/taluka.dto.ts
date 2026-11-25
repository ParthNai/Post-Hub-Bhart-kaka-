import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateTalukaDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  districtId: string;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateTalukaDto extends IntersectionType(
  CreateTalukaDto,
  _IdDto,
) {}

export class TalukaQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateTalukaDto),
) {}
export class AllTalukaQueryDto extends IntersectionType(
  PartialType(UpdateTalukaDto),
) {}
