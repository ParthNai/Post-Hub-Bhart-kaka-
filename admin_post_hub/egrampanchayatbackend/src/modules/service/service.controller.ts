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
import { ServiceService } from './service.service';
import {
  AllServiceQueryDto,
  CreateServiceDto,
  ServiceQueryDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create({
      ...createServiceDto,
    });
  }

  @Get()
  find(@Query() query: ServiceQueryDto) {
    console.log('query', query);
    return this.serviceService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllServiceQueryDto) {
    return this.serviceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch()
  update(@Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update({
      ...updateServiceDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.serviceService.remove(id);
  }
}
