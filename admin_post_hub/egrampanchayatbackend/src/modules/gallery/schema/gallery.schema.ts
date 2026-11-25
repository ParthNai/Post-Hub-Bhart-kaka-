import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  images: string[];

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

export const GallerySchema = SchemaFactory.createForClass(Gallery);
