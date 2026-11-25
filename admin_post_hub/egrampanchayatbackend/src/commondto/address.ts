import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true, minlength: 6, maxlength: 6 })
  pinCode: number;

  @Prop({ required: true })
  postOffice: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  taluka: string;

  @Prop({ required: true })
  district: string;
  @Prop({ required: true })
  state: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

export class AddressDto {
  @ApiProperty()
  street: string;

  @Prop({ required: true, minlength: 6, maxlength: 6 })
  pinCode: number;

  @ApiProperty()
  postOffice: string;

  @ApiProperty()
  area: string;

  @ApiProperty()
  taluka: string;

  @ApiProperty()
  district: string;
  @ApiProperty()
  state: string;
}
