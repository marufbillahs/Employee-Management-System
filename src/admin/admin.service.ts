import { Injectable, NotFoundException, ConflictException , BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/entities/user.entity'; 


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async updateEmail(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({where: { id },relations: ['user']});
    if (!admin) throw new NotFoundException('Admin not found');

    if (dto.email) {
      const exists = await this.userRepo.findOne({ where: { email: dto.email } });
      if (exists && exists.id !== admin.user.id) {
        throw new ConflictException('Email already in use');
      }

      admin.user.email = dto.email!;
      await this.userRepo.save(admin.user);
    }

    return this.adminRepo.save(admin);
  }
   // Update password method
  async updatePassword(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepo.findOne({where: { id },relations: ['user']});
    if (!admin) throw new NotFoundException('Admin not found');
    // First check if email matches
    if (!dto.email || dto.email !== admin.user.email) {
      throw new BadRequestException('Email does not match');
    }
    // Then update password
    if (dto.password && typeof dto.password === 'string') {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      admin.user.password = hashedPassword;
      await this.userRepo.save(admin.user);
    } else {
      throw new BadRequestException('Password must be a valid string');
    }
    return this.adminRepo.save(admin);
  }
}
