import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null }) branchId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Tenant', default: null }) tenantId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Customer' }) customerId: Types.ObjectId;
  @Prop({ enum: ['hotel', 'cafe', 'cinema'], required: true }) industry: string;
  @Prop({ unique: true }) bookingNo: string;
  @Prop({ enum: ['pending','confirmed','checked_in','checked_out','cancelled'], default: 'pending' }) status: string;
  @Prop() resourceId: string; // roomId / tableId / showtimeId
  @Prop() resourceName: string;
  @Prop({ default: null }) startDate: Date;
  @Prop() endDate: Date;
  @Prop({ default: 1 }) guestCount: number;
  @Prop({ default: 0 }) totalAmount: number;
  @Prop({ default: 0 }) depositAmount: number;
  @Prop({ default: 0 }) paidAmount: number;
  @Prop({ enum: ['none','full','deposit','preauth'], default: 'none' }) prepayType: string;
  @Prop({ enum: ['pending','paid','partial','refunded'], default: 'pending' }) paymentStatus: string;
  @Prop({ trim: true }) guestName: string;
  @Prop({ trim: true }) guestPhone: string;
  @Prop({ trim: true }) guestEmail: string;
  @Prop({ trim: true }) note: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ branchId: 1, startDate: 1 });
BookingSchema.index({ customerId: 1 });
BookingSchema.pre('save', function(next) {
  if (!this.bookingNo) this.bookingNo = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  next();
});
