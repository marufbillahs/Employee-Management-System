import {Injectable,UnauthorizedException,BadRequestException,Inject,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/entities/admin.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './role/role';
import { User } from './entities/user.entity';
import { EmailService } from './email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `verify:${dto.email}`;

    await this.cacheManager.set(
      key,
      {
        ...dto,
        password: hashedPassword,
        verificationCode,
      },
      600_000, // 10 minutes in milliseconds
    );

    await this.emailService.sendVerificationEmail(dto.email, verificationCode);
    return { message: 'Verification code sent. Please check your email.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const key = `verify:${dto.email}`;
    const cached = await this.cacheManager.get<any>(key);
  
    if (!cached || cached.verificationCode !== dto.code) {
      throw new BadRequestException('Invalid or expired verification code');
    }
  
    const user = this.userRepo.create({
      email: cached.email,
      password: cached.password,
      name: cached.name,
      role: cached.role,
      isVerified: true,
    });
  
    const savedUser = await this.userRepo.save(user);
  
    if (cached.role === UserRole.ADMIN) {
      const admin = this.adminRepo.create({ user: savedUser }); 
      await this.adminRepo.save(admin);
    }
  
    await this.cacheManager.del(key);
    return { message: 'Email verified and account created successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid password');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      message: `Welcome ${user.name}, you are logged in as ${user.role}`,
    };
  }
}
