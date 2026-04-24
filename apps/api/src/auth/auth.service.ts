import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId,
        isActive: user.isActive,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, role, tenantId, branchId } = registerDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new this.userModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: role || UserRole.STAFF,
      tenantId: tenantId || null,
      branchId: branchId || null,
    });

    await user.save();

    return {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId,
      branchId: user.branchId,
      isActive: user.isActive,
      createdAt: user['createdAt'],
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user.toObject();
    return result;
  }
}
