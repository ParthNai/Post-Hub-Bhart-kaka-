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
import { TalukaService } from './taluka.service';
import {
  AllTalukaQueryDto,
  CreateTalukaDto,
  TalukaQueryDto,
  UpdateTalukaDto,
} from './dto/taluka.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('taluka')
@Controller('taluka')
export class TalukaController {
  constructor(private readonly talukaService: TalukaService) {}

  @Post()
  create(@Body() createTalukaDto: CreateTalukaDto) {
    return this.talukaService.create({
      ...createTalukaDto,
    });
  }

  @Get()
  find(@Query() query: TalukaQueryDto) {
    console.log('query', query);
    return this.talukaService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllTalukaQueryDto) {
    return this.talukaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talukaService.findOne(id);
  }

  @Patch()
  update(@Body() updateTalukaDto: UpdateTalukaDto) {
    return this.talukaService.update({
      ...updateTalukaDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.talukaService.remove(id);
  }
}
