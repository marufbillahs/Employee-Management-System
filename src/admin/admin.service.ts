import { Injectable, NotFoundException, ConflictException , BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  async updateEmail(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (dto.email) {
      const exists = await this.adminRepo.findOne({ where: { email: dto.email } });
      if (exists && exists.id !== id) {
        throw new ConflictException('Email already in use');
      }
      admin.email = dto.email;
    }

    return this.adminRepo.save(admin);
  }
  // Update password method
  async updatePassword(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
  
    // First check if email matches
    if (!dto.email || dto.email !== admin.email) {
      throw new BadRequestException('Email does not match');
    }
  
    // Then update password
    if (dto.password && typeof dto.password === 'string') {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      admin.password = hashedPassword;
    } else {
      throw new BadRequestException('Password must be a valid string');
    }
  
    return this.adminRepo.save(admin);
  }
  
  
  
}
