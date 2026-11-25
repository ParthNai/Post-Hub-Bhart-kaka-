import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HeaderDocument = HydratedDocument<Header>;

@Schema({ timestamps: true })
export class Header {
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
}

export const HeaderSchema = SchemaFactory.createForClass(Header);
