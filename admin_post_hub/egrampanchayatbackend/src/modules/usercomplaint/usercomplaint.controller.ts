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
import { UserComplaintService } from './usercomplaint.service';
import {
  AllUserComplaintQueryDto,
  CreateUserComplaintDto,
  UserComplaintQueryDto,
  UpdateUserComplaintDto,
} from './dto/usercomplaint.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('usercomplaint')
@Controller('usercomplaint')
export class UserComplaintController {
  constructor(private readonly usercomplaintService: UserComplaintService) {}

  @Post()
  create(@Body() createUserComplaintDto: CreateUserComplaintDto) {
    return this.usercomplaintService.create({
      ...createUserComplaintDto,
    });
  }

  @Get()
  find(@Query() query: UserComplaintQueryDto) {
    console.log('query', query);
    return this.usercomplaintService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllUserComplaintQueryDto) {
    return this.usercomplaintService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usercomplaintService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserComplaintDto: UpdateUserComplaintDto) {
    return this.usercomplaintService.update({
      ...updateUserComplaintDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.usercomplaintService.remove(id);
  }
}
