import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true, collection: 'attendance' })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  checkIn: Date;

  @Prop()
  checkOut: Date;

  @Prop({ type: Number, default: 0 })
  totalHours: number;

  @Prop({ enum: ['present', 'absent', 'late', 'leave'], default: 'present' })
  status: string;

  @Prop({ trim: true })
  note: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ staffId: 1, date: 1 });
AttendanceSchema.index({ branchId: 1, date: 1 });
