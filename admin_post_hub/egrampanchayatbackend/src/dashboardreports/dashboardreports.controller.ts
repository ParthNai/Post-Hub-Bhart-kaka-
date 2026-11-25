import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardreportsService } from './dashboardreports.service';

@Controller('dashboardreports')
@ApiTags('Admin Dashboard')
export class DashboardreportsController {
  constructor(
    private readonly dashboardreportsService: DashboardreportsService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return await this.dashboardreportsService.getDashboard();
  }
}
