import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/entities/admin.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  async register(registerDto: RegisterDto): Promise<Admin> {
    const existing = await this.adminRepo.findOne({ where: { email: registerDto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(registerDto.password, 10);
    const newAdmin = this.adminRepo.create({ ...registerDto, password: hashed });
    return this.adminRepo.save(newAdmin);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const admin = await this.adminRepo.findOne({ where: { email: loginDto.email } });
    if (!admin) throw new UnauthorizedException('Invalid  email ');

    const match = await bcrypt.compare(loginDto.password, admin.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    return `Welcome ${admin.name}, you are logged in as ${admin.role}`;
  }
}
