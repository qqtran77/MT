import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class RegisterDto {
  @ApiProperty({ example: 'nguyen.van.a@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.STAFF })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  branchId?: string;
}
