import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  BRANCH_MANAGER = 'branch_manager',
  STAFF = 'staff',
  ACCOUNTANT = 'accountant',
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', default: null })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  branchId: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STAFF,
  })
  role: UserRole;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ tenantId: 1, role: 1 });
