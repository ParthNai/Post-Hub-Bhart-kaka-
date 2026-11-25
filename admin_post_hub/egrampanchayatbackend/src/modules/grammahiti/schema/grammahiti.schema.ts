import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { WEBSITE } from 'src/enums';
import { District } from 'src/modules/district/schema/district.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';
import { TABLEHADERTYPES } from '../enums/grammahiti.enum';
import { TableSection } from 'src/modules/tablesection/schema/tablesection.schema';
import { TableHeader } from 'src/modules/tableheader/schema/tableheader.schema';

export type GramMahitiDocument = HydratedDocument<GramMahiti>;

@Schema({ timestamps: true })
export class GramMahiti {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true, default: TABLEHADERTYPES.TEXT })
  type: TABLEHADERTYPES;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Panchayat.name,
  })
  panchayatId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: TableSection.name,
  })
  sectionId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: TableHeader.name,
  })
  headerId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  recordAddId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const GramMahitiSchema = SchemaFactory.createForClass(GramMahiti);
