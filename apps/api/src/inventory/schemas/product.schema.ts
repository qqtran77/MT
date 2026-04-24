import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  sku: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  category: string;

  @Prop({ trim: true, default: 'cái' })
  unit: string;

  @Prop({ type: Number, default: 0 })
  minThreshold: number;

  @Prop({ type: Number, default: 0 })
  maxThreshold: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ tenantId: 1, category: 1 });
ProductSchema.index({ sku: 1 }, { unique: true });
