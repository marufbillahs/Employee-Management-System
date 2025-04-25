import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';

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
}
