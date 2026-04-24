import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true }) tenantId: Types.ObjectId;
  @Prop({ required: true, trim: true }) fullName: string;
  @Prop({ trim: true }) phone: string;
  @Prop({ trim: true, lowercase: true }) email: string;
  @Prop({ trim: true }) address: string;
  @Prop({ default: 0 }) loyaltyPoints: number;
  @Prop({ default: 0 }) totalSpent: number;
  @Prop({ enum: ['bronze','silver','gold','platinum'], default: 'bronze' }) tier: string;
  @Prop({ default: true }) isActive: boolean;
  createdAt: Date; updatedAt: Date;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ tenantId: 1, phone: 1 });
CustomerSchema.index({ tenantId: 1, email: 1 });
