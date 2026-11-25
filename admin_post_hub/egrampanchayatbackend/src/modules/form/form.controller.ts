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
import { FormService } from './form.service';
import {
  AllFormQueryDto,
  CreateFormDto,
  FormQueryDto,
  UpdateFormDto,
} from './dto/form.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('form')
@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  create(@Body() createFormDto: CreateFormDto) {
    return this.formService.create({
      ...createFormDto,
    });
  }

  @Get()
  find(@Query() query: FormQueryDto) {
    console.log('query', query);
    return this.formService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllFormQueryDto) {
    return this.formService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formService.findOne(id);
  }

  @Patch()
  update(@Body() updateFormDto: UpdateFormDto) {
    return this.formService.update({
      ...updateFormDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.formService.remove(id);
  }
}
