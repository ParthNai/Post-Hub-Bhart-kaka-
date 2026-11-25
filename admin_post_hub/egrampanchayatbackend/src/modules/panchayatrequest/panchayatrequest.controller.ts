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
import { PanchayatRequestService } from './panchayatrequest.service';
import {
  AllPanchayatRequestQueryDto,
  CreatePanchayatRequestDto,
  PanchayatRequestQueryDto,
  UpdatePanchayatRequestDto,
} from './dto/panchayatrequest.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('panchayatrequest')
@Controller('panchayatrequest')
export class PanchayatRequestController {
  constructor(
    private readonly panchayatrequestService: PanchayatRequestService,
  ) {}

  @Post()
  create(@Body() createPanchayatRequestDto: CreatePanchayatRequestDto) {
    return this.panchayatrequestService.create({
      ...createPanchayatRequestDto,
    });
  }

  @Get()
  find(@Query() query: PanchayatRequestQueryDto) {
    console.log('query', query);
    return this.panchayatrequestService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllPanchayatRequestQueryDto) {
    return this.panchayatrequestService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panchayatrequestService.findOne(id);
  }

  @Patch()
  update(@Body() updatePanchayatRequestDto: UpdatePanchayatRequestDto) {
    return this.panchayatrequestService.update({
      ...updatePanchayatRequestDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.panchayatrequestService.remove(id);
  }
}
