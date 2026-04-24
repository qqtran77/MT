import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type CommissionDocument = Commission & Document;

@Schema({ timestamps: true, collection: 'commissions' })
export class Commission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) referrerId: Types.ObjectId;
  @Prop({ required: true, unique: true }) referralCode: string;
  @Prop({ type: Types.ObjectId, ref: 'Booking' }) bookingId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Customer' }) customerId: Types.ObjectId;
  @Prop({ required: true }) bookingAmount: number;
  @Prop({ required: true }) commissionRate: number; // e.g. 0.05 = 5%
  @Prop({ required: true }) commissionAmount: number;
  @Prop({ enum: ['pending','approved','paid','rejected'], default: 'pending' }) status: string;
  @Prop() paidAt: Date;
  @Prop() note: string;
  @Prop({ type: Types.ObjectId, ref: 'Branch' }) branchId: Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}
export const CommissionSchema = SchemaFactory.createForClass(Commission);
CommissionSchema.index({ referrerId: 1, status: 1 });
CommissionSchema.index({ referralCode: 1 });
