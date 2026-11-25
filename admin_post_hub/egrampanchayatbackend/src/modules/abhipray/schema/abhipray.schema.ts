import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { WEBSITE } from 'src/enums';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type AbhiprayDocument = HydratedDocument<Abhipray>;

@Schema({ timestamps: true })
export class Abhipray {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  occupation: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  position: number;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Panchayat.name,
  })
  panchayatId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const AbhipraySchema = SchemaFactory.createForClass(Abhipray);
