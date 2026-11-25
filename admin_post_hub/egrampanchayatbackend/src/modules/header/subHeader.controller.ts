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
import {
  AllSubHeaderQueryDto,
  CreateSubHeaderDto,
  SubHeaderQueryDto,
  UpdateSubHeaderDto,
} from './dto/subHeader.dto';
import { ApiTags } from '@nestjs/swagger';
import { SubHeaderService } from './subHeader.service';

@ApiTags('sub-header')
@Controller('sub-header')
export class SubHeaderController {
  constructor(private readonly subHeaderService: SubHeaderService) {}

  @Post()
  create(@Body() createSubHeaderDto: CreateSubHeaderDto) {
    return this.subHeaderService.create({
      ...createSubHeaderDto,
    });
  }

  @Get()
  find(@Query() query: SubHeaderQueryDto) {
    console.log('query', query);
    return this.subHeaderService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllSubHeaderQueryDto) {
    return this.subHeaderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subHeaderService.findOne(id);
  }

  @Patch()
  update(@Body() updateSubHeaderDto: UpdateSubHeaderDto) {
    return this.subHeaderService.update({
      ...updateSubHeaderDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.subHeaderService.remove(id);
  }
}
