import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type PanchayatMemberDocument = HydratedDocument<PanchayatMember>;

@Schema({ timestamps: true })
export class PanchayatMember {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  occupation: string;

  @Prop({ required: false })
  mobile: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  position: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Panchayat.name,
  })
  panchayatId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const PanchayatMemberSchema =
  SchemaFactory.createForClass(PanchayatMember);
