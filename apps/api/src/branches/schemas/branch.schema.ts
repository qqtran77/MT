import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BranchDocument = Branch & Document;

export enum Industry {
  HOTEL = 'hotel',
  CAFE = 'cafe',
  CINEMA = 'cinema',
}

@Schema({ timestamps: true, collection: 'branches' })
export class Branch {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(Industry),
    required: true,
  })
  industry: Industry;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
BranchSchema.index({ tenantId: 1, industry: 1 });
BranchSchema.index({ tenantId: 1, isActive: 1 });
