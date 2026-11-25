import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop({ required: false, unique: false })
  website: string;

  @Prop({ required: false, default: false })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
