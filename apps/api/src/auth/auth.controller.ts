import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './jwt-auth.guard';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai email hoặc mật khẩu' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tài khoản mới (admin only)' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thông tin người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin user' })
  async getMe(@Request() req) {
    return this.authService.getMe(req.user._id);
  }
}
