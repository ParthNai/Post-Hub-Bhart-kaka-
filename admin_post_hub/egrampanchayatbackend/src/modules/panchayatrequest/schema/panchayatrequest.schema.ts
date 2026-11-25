import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type PanchayatRequestDocument = HydratedDocument<PanchayatRequest>;

@Schema({ timestamps: true })
export class PanchayatRequest {
  @Prop({ required: false })
  email: string;

  @Prop({ required: true })
  gramname: string;

  @Prop({ required: true })
  talukaname: string;

  @Prop({ required: true })
  districtname: string;

  @Prop({ required: true })
  anyname: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false, default: 'auto' })
  createdBy: string;
}

export const PanchayatRequestSchema =
  SchemaFactory.createForClass(PanchayatRequest);
