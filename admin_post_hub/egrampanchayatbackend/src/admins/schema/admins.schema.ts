import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ROLES } from '../admin.enum';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true, required: true })
  mobile: string;

  @Prop({ unique: true })
  password: string;

  @Prop({ default: ROLES.PANCHAYATADMIN })
  role: ROLES;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: Panchayat.name })
  panchayatId: mongoose.Schema.Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
