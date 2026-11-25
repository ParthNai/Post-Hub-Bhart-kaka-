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
import { DistrictService } from './district.service';
import {
  AllDistrictQueryDto,
  CreateDistrictDto,
  DistrictQueryDto,
  UpdateDistrictDto,
} from './dto/district.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('district')
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create({
      ...createDistrictDto,
    });
  }

  @Get()
  find(@Query() query: DistrictQueryDto) {
    console.log('query', query);
    return this.districtService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllDistrictQueryDto) {
    return this.districtService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(id);
  }

  @Patch()
  update(@Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update({
      ...updateDistrictDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.districtService.remove(id);
  }
}
