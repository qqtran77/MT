import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty() @IsString() branchId: string;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sku?: string;
  @ApiPropertyOptional({ enum: ['ingredient','beverage','amenity','equipment','other'] }) @IsOptional() @IsEnum(['ingredient','beverage','amenity','equipment','other']) category?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) quantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) minQuantity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) costPrice?: number;
}
export class UpdateInventoryItemDto extends PartialType(CreateInventoryItemDto) {}

export class StockMovementDto {
  @ApiProperty() @IsString() itemId: string;
  @ApiProperty({ enum: ['in','out','adjust'] }) @IsEnum(['in','out','adjust']) type: string;
  @ApiProperty() @IsNumber() quantity: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}
