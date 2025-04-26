import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Patch(':id/email')
  updateEmail(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.adminService.updateEmail(id, dto);
  }

  // Update password endpoint
  @Patch(':id/password')
  updatePassword(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdminDto) {
    return this.adminService.updatePassword(id, dto);
  }
}
