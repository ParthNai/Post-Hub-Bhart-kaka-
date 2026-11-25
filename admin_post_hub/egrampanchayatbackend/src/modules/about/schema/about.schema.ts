import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { WEBSITE } from 'src/enums';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type AboutDocument = HydratedDocument<About>;

@Schema({ timestamps: true })
export class About {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: false })
  linkTitle: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  image: string;

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

  @Prop({ required: false, default: 0 })
  visitors: number;
}

export const AboutSchema = SchemaFactory.createForClass(About);
