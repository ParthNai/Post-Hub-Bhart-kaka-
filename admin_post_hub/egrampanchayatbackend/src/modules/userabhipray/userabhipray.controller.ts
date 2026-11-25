import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UserAbhiprayService } from './userabhipray.service';
import {
  AllUserAbhiprayQueryDto,
  CreateUserAbhiprayDto,
  UserAbhiprayQueryDto,
  UpdateUserAbhiprayDto,
} from './dto/userabhipray.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('userabhipray')
@Controller('userabhipray')
export class UserAbhiprayController {
  constructor(private readonly userabhiprayService: UserAbhiprayService) {}

  @Post()
  create(@Body() createUserAbhiprayDto: CreateUserAbhiprayDto) {
    return this.userabhiprayService.create({
      ...createUserAbhiprayDto,
    });
  }

  @Get()
  find(@Query() query: UserAbhiprayQueryDto,@RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    console.log('query', query);
    return this.userabhiprayService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllUserAbhiprayQueryDto) {
    return this.userabhiprayService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userabhiprayService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserAbhiprayDto: UpdateUserAbhiprayDto) {
    return this.userabhiprayService.update({
      ...updateUserAbhiprayDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.userabhiprayService.remove(id);
  }
}
