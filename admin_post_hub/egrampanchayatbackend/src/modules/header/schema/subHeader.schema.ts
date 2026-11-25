import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Header } from './header.schema';

export type SubHeaderDocument = HydratedDocument<SubHeader>;

@Schema({ timestamps: true })
export class SubHeader {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: true, unique: false })
  link: string;

  @Prop({ required: false, default: false })
  external: boolean;

  @Prop({ required: true })
  position: number;
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Header.name,
  })
  headerId: mongoose.Schema.Types.ObjectId;
}

export const SubHeaderSchema = SchemaFactory.createForClass(SubHeader);
