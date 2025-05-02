import { Controller, Patch, Param, Body, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //update password
  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  updatePassword(@Request() req, @Body() dto: UpdateAdminDto) {
    const userId = req.user.id;
    return this.adminService.updatePassword(userId, dto);
  }


}
