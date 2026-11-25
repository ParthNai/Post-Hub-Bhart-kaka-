import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchemeCategoryDocument = HydratedDocument<SchemeCategory>;

@Schema({ timestamps: true })
export class SchemeCategory {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: false, unique: false })
  position: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const SchemeCategorySchema =
  SchemaFactory.createForClass(SchemeCategory);
