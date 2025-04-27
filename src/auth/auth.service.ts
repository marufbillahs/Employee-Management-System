import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/entities/admin.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Admin> {
    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newAdmin = this.adminRepo.create({ ...dto, password: hashedPassword });
    return this.adminRepo.save(newAdmin);
  }

  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new UnauthorizedException('Invalid email');

    const passwordMatch = await bcrypt.compare(dto.password, admin.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid password');

    const payload = { id: admin.id, email: admin.email, role: admin.role };
    const token = this.jwtService.sign(payload);

    return { 
      access_token: token, 
      message: `Welcome ${admin.name}, you are logged in as ${admin.role}` 
    };
    
  }
}
