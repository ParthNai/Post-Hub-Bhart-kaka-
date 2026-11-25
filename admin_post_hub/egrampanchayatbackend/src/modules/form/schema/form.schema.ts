import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormDocument = HydratedDocument<Form>;

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: false, unique: false })
  website: string;

  @Prop({ required: false, unique: false })
  link: string;

  @Prop({ required: true, unique: false })
  position: number;

  @Prop({ required: false, unique: false })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  external: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
