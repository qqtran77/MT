import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty() @IsString() staffId: string;
  @ApiProperty() @IsString() branchId: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() checkIn?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() checkOut?: string;
  @ApiPropertyOptional({ enum: ['present', 'absent', 'late', 'leave'] })
  @IsOptional() @IsEnum(['present', 'absent', 'late', 'leave']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
