import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsEmail, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() branchId?: string;
  @ApiPropertyOptional({ enum: ['hotel','cafe','cinema'] }) @IsOptional() @IsEnum(['hotel','cafe','cinema']) industry?: string;
  // Support old field name 'type' as alias for industry
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceName?: string;
  @ApiPropertyOptional() @IsOptional() startDate?: string;
  @ApiPropertyOptional() @IsOptional() endDate?: string;
  // Support old field names checkIn/checkOut
  @ApiPropertyOptional() @IsOptional() checkIn?: string;
  @ApiPropertyOptional() @IsOptional() checkOut?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) guestCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() depositAmount?: number;
  @ApiPropertyOptional({ enum: ['none','full','deposit','preauth'] }) @IsOptional() @IsEnum(['none','full','deposit','preauth']) prepayType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guestName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guestPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerPhone?: string;
  @ApiPropertyOptional() @IsOptional() guestEmail?: string;
  @ApiPropertyOptional() @IsOptional() customerEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiPropertyOptional({ enum: ['pending','confirmed','checked_in','checked_out','cancelled'] }) @IsOptional() @IsEnum(['pending','confirmed','checked_in','checked_out','cancelled']) status?: string;
}
export class PrepayDto {
  @ApiProperty({ enum: ['full','deposit','preauth'] }) @IsEnum(['full','deposit','preauth']) type: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional({ enum: ['cash','card','transfer','momo','vnpay'] }) @IsOptional() @IsEnum(['cash','card','transfer','momo','vnpay']) paymentMethod?: string;
}
