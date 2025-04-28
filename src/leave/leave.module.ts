// src/leave/leave.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { Leave } from './entities/leave.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Leave])],
  providers: [LeaveService],
  controllers: [LeaveController],
})
export class LeaveModule {}
