import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type ContactRequestDocument = HydratedDocument<ContactRequest>;

@Schema({ timestamps: true })
export class ContactRequest {
  @Prop({ required: false })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mobile: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Panchayat.name,
  })
  panchayatId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  createdBy: string;
}

export const ContactRequestSchema =
  SchemaFactory.createForClass(ContactRequest);
