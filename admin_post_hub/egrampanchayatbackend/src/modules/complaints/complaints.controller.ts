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
import { ComplaintService } from './complaints.service';
import {
  AllComplaintQueryDto,
  CreateComplaintDto,
  ComplaintQueryDto,
  UpdateComplaintDto,
} from './dto/complaints.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('complaint')
@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.create({
      ...createComplaintDto,
    });
  }

  @Get()
  find(@Query() query: ComplaintQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;
    console.log('query', query);
    return this.complaintService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllComplaintQueryDto) {
    return this.complaintService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(id);
  }

  @Patch()
  update(@Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintService.update({
      ...updateComplaintDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.complaintService.remove(id);
  }
}
