import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, RequestUser } from 'src/auth/auth.decorator';
import { AdminsService } from './admins.service';
import {
  AdminDto,
  AdminQueryDto,
  CreateAdminDto,
  UpdateAdminDto,
} from './dto/admins.dto';

@ApiTags('Admin')
@Controller({ path: 'admin' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Public()
  @Post()
  create(@Body() admin: CreateAdminDto) {
    return this.adminsService.create(admin);
  }

  @Post('panchayatadmin')
  createSalonAdmin(@Body() admin: CreateAdminDto) {
    return this.adminsService.create(admin);
  }

  @Get()
  findAll(@Query() query: AdminQueryDto) {
    return this.adminsService.findAll(query);
  }

  @Patch()
  update(@Body() updateThemeDto: UpdateAdminDto) {
    return this.adminsService.update(updateThemeDto);
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.adminsService.remove(id);
  }

  //myadmins

  @Post('myadmin')
  createMyAdmin(@Body() admin: CreateAdminDto, @RequestUser() user: AdminDto) {
    return this.adminsService.createMyAdmin(admin, user);
  }

  @Get('myadmin')
  findAllMyAdmins(
    @Query() query: AdminQueryDto,
    @RequestUser() user: AdminDto,
  ) {
    query.panchayatId = user.panchayatId;
    return this.adminsService.findAll(query);
  }

  @Patch('myadmin')
  updateMyAdmin(
    @Body() updateThemeDto: UpdateAdminDto,
    @RequestUser() user: AdminDto,
  ) {
    return this.adminsService.updateMyAdmin(updateThemeDto, user);
  }

  @Delete('myadmin')
  removeMyAdmin(@Body('_id') id: string, @RequestUser() user: AdminDto) {
    return this.adminsService.removeMyAdmin(id, user);
  }

  @Get('myadmin/:id')
  findOneMyAdmin(@Param('id') id: string, @RequestUser() user: AdminDto) {
    return this.adminsService.findOneMyAdmin(id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }
}
