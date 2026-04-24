import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsEmail, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty() @IsString() branchId: string;
  @ApiProperty({ enum: ['hotel','cafe','cinema'] }) @IsEnum(['hotel','cafe','cinema']) industry: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resourceName?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) guestCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() depositAmount?: number;
  @ApiPropertyOptional({ enum: ['none','full','deposit','preauth'] }) @IsOptional() @IsEnum(['none','full','deposit','preauth']) prepayType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guestName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guestPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() guestEmail?: string;
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
