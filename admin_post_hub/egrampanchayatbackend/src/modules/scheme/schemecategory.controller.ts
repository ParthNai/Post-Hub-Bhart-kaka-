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
import { SchemeCategoryService } from './schemecategory.service';
import {
  AllSchemeCategoryQueryDto,
  CreateSchemeCategoryDto,
  SchemeCategoryQueryDto,
  UpdateSchemeCategoryDto,
} from './dto/schemecategory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('schemecategory')
@Controller('schemecategory')
export class SchemeCategoryController {
  constructor(private readonly schemecategoryService: SchemeCategoryService) {}

  @Post()
  create(@Body() createServiceDto: CreateSchemeCategoryDto) {
    return this.schemecategoryService.create({
      ...createServiceDto,
    });
  }

  @Get()
  find(@Query() query: SchemeCategoryQueryDto) {
    console.log('query', query);
    return this.schemecategoryService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllSchemeCategoryQueryDto) {
    return this.schemecategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemecategoryService.findOne(id);
  }

  @Patch()
  update(@Body() updateServiceDto: UpdateSchemeCategoryDto) {
    return this.schemecategoryService.update({
      ...updateServiceDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.schemecategoryService.remove(id);
  }
}
