import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/entities/admin.entity';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EmployeeModule } from './employee/employee.module';
import { Employee } from './employee/entities/employee.entity';
import { LeaveModule } from './leave/leave.module';
import { Leave } from './leave/entities/leave.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'employeemanagementsystem',
      entities: [Admin,Employee,Leave],
      synchronize: true,
    }),
    AuthModule,
    AdminModule,
    EmployeeModule,
    LeaveModule,
  ],
})
export class AppModule {}
