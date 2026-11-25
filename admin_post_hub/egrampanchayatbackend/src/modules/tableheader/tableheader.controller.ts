import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
} from '@nestjs/common';
import { TableHeaderService } from './tableheader.service';
import {
  CreateTableHeaderDto,
  TableHeaderQueryDto,
  UpdateTableHeaderDto,
} from './dto/tableheader.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';

@ApiTags('tableheader')
@Controller('tableheader')
export class TableHeaderController {
  constructor(private readonly tableheaderService: TableHeaderService) {}

  @Post()
  create(@Body() createTableHeaderDto: CreateTableHeaderDto) {
    return this.tableheaderService.create({
      ...createTableHeaderDto,
    });
  }

  @Get()
  find(@Query() query: TableHeaderQueryDto) {
    console.log('query', query);
    return this.tableheaderService.find(query);
  }

  @Get('all')
  findAll(@Query() query: TableHeaderQueryDto) {
    return this.tableheaderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableheaderService.findOne(id);
  }

  @Patch()
  update(@Body() updateTableHeaderDto: UpdateTableHeaderDto) {
    return this.tableheaderService.update({
      ...updateTableHeaderDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.tableheaderService.remove(id);
  }
}
