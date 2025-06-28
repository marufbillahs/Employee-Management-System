import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { User } from 'src/auth/entities/user.entity';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notice, User])], // ✅ THIS LINE IS CRITICAL
  providers: [NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}
