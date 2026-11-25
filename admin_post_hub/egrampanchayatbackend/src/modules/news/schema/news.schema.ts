import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: false, unique: false })
  website: string;

  @Prop({ required: false, unique: false })
  link: string;

  @Prop({ required: true, unique: false })
  position: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  external: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
