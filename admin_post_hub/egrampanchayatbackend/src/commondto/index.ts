import { Prop } from '@nestjs/mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';

import { ObjectId } from 'mongoose';
// import { Request as AppRequest } from 'express';
import { AdminDto } from 'src/admins/dto/admins.dto';

import { Transform } from 'class-transformer';
import { cloneDeep } from 'lodash';

export function Default(defaultValue: unknown): PropertyDecorator {
  return Transform((value: unknown) => value ?? cloneDeep(defaultValue));
}
export class _IdDto {
  @ApiHideProperty()
  _id: ObjectId;
}

export class VisibleIdDto {
  @ApiProperty()
  _id: string;
}

export class UserRequest extends IntersectionType(
  Request,
  PartialType(
    class {
      user: AdminDto;
    },
  ),
) {}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 'true' })
  paginate?: string = 'true';

  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  limit?: number;

  @ApiPropertyOptional()
  pageSize?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  previous?: string;

  @ApiPropertyOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  toDate?: string;
}

export class StringInObject {
  [key: string]: string;
}
