import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DistrictDocument = HydratedDocument<District>;

@Schema({ timestamps: true })
export class District {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
