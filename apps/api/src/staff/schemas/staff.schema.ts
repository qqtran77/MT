import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StaffDocument = Staff & Document;

export enum ContractType {
  FULL = 'full',
  PART = 'part',
  SEASONAL = 'seasonal',
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROBATION = 'probation',
}

@Schema({ timestamps: true, collection: 'staff' })
export class Staff {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  employeeCode: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ lowercase: true, trim: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Position', default: null })
  positionId: Types.ObjectId;

  @Prop({ trim: true })
  positionName: string;

  @Prop({
    type: String,
    enum: Object.values(ContractType),
    default: ContractType.FULL,
  })
  contractType: ContractType;

  @Prop({ type: Number, default: 0 })
  baseSalary: number;

  @Prop({
    type: String,
    enum: Object.values(StaffStatus),
    default: StaffStatus.PROBATION,
  })
  status: StaffStatus;

  @Prop({ type: Date })
  hiredAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
StaffSchema.index({ branchId: 1, status: 1 });
StaffSchema.index({ tenantId: 1 });
StaffSchema.index({ employeeCode: 1 }, { unique: true });
StaffSchema.index({ isDeleted: 1 });
