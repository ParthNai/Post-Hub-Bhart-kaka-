import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchemeCategory } from './schemecategory.schema';

export type SchemeDocument = HydratedDocument<Scheme>;

@Schema({ timestamps: true })
export class Scheme {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: true, unique: false })
  link: string;

  @Prop({ required: false, unique: false })
  description: string;

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
    ref: SchemeCategory.name,
  })
  categoryId: mongoose.Schema.Types.ObjectId;
}

export const SchemeSchema = SchemaFactory.createForClass(Scheme);
