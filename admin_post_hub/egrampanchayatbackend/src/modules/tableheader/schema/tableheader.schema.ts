import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';
import { TABLEHADERTYPES } from '../enums/tableheader.enum';
import { TableSection } from 'src/modules/tablesection/schema/tablesection.schema';

export type TableHeaderDocument = HydratedDocument<TableHeader>;

@Schema({ timestamps: true })
export class TableHeader {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: TABLEHADERTYPES.TEXT })
  type: TABLEHADERTYPES;

  @Prop({ required: true })
  position: number;

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

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: false, default: false })
  isHidden: boolean;
}

export const TableHeaderSchema = SchemaFactory.createForClass(TableHeader);
