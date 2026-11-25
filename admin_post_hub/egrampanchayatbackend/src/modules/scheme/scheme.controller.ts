import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  AllSchemeQueryDto,
  CreateSchemeDto,
  SchemeQueryDto,
  UpdateSchemeDto,
} from './dto/scheme.dto';
import { ApiTags } from '@nestjs/swagger';
import { SchemeService } from './scheme.service';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('scheme')
@Controller('scheme')
export class SchemeController {
  constructor(private readonly SchemeService: SchemeService) {}

  @Post()
  create(
    @Body() createSchemeDto: CreateSchemeDto,
    @RequestUser() user: AdminDto,
  ) {
    return this.SchemeService.create({
      ...createSchemeDto,
    });
  }

  @Get()
  find(@Query() query: SchemeQueryDto) {
    console.log('query', query);
    return this.SchemeService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllSchemeQueryDto) {
    return this.SchemeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.SchemeService.findOne(id);
  }

  @Patch()
  update(@Body() updateSchemeDto: UpdateSchemeDto) {
    return this.SchemeService.update({
      ...updateSchemeDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.SchemeService.remove(id);
  }
}
