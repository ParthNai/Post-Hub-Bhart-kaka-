import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Admin } from 'src/admins/schema/admins.schema';
import { District } from 'src/modules/district/schema/district.schema';
import { Taluka } from 'src/modules/taluka/schema/taluka.schema';

export type PanchayatDocument = HydratedDocument<Panchayat>;

@Schema({ timestamps: true })
export class Panchayat {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  nameInGj: string;

  @Prop({ required: true })
  subDomain: string;

  @Prop({ required: true })
  logoPath: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'admins',
  })
  adminId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Taluka.name,
  })
  talukaId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: District.name,
  })
  districtId: mongoose.Schema.Types.ObjectId;
}

export const PanchayatSchema = SchemaFactory.createForClass(Panchayat);
PanchayatSchema.index({ name: 1, nameInGj: 1 });
