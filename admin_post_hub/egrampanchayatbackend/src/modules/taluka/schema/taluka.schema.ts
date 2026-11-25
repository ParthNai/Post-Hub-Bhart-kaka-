import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { District } from 'src/modules/district/schema/district.schema';

export type TalukaDocument = HydratedDocument<Taluka>;

@Schema({ timestamps: true })
export class Taluka {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: District.name,
  })
  districtId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const TalukaSchema = SchemaFactory.createForClass(Taluka);
