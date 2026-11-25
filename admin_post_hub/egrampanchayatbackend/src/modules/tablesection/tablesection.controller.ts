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
import { TableSectionService } from './tablesection.service';
import {
  CreateTableSectionDto,
  TableSectionQueryDto,
  UpdateTableSectionDto,
} from './dto/tablesection.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';

@ApiTags('tablesection')
@Controller('tablesection')
export class TableSectionController {
  constructor(private readonly tablesectionService: TableSectionService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createTableSectionDto: CreateTableSectionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tablesectionService.create({
      ...createTableSectionDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: TableSectionQueryDto) {
    console.log('query', query);
    return this.tablesectionService.find(query);
  }

  @Get('all')
  findAll(@Query() query: TableSectionQueryDto) {
    return this.tablesectionService.findAll(query);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateTableSectionDto: UpdateTableSectionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tablesectionService.update({
      ...updateTableSectionDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.tablesectionService.remove(id);
  }

  @Get('panchayatsections')
  panchayatSections() {
    console.log('panchayat sec');
    return this.tablesectionService.panchayatSections();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesectionService.findOne(id);
  }
}
