import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { WEBSITE } from 'src/enums';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type ImportantLinkDocument = HydratedDocument<ImportantLink>;

@Schema({ timestamps: true })
export class ImportantLink {
  @Prop({ required: false, default: false })
  external: boolean;

  @Prop({ required: false })
  link: string;

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
}

export const ImportantLinkSchema = SchemaFactory.createForClass(ImportantLink);
