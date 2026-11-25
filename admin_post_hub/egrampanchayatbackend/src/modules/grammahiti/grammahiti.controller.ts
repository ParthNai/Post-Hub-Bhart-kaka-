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
  UploadedFiles,
} from '@nestjs/common';
import { GramMahitiService } from './grammahiti.service';
import {
  CreateGramMahitiDto,
  GramMahitiQueryDto,
  UpdateGramMahitiDto,
} from './dto/grammahiti.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('grammahiti')
@Controller('grammahiti')
export class GramMahitiController {
  constructor(private readonly grammahitiService: GramMahitiService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor(multerOptions(mimeTypes.images)))
  create(
    @Body() createGramMahitiDto: CreateGramMahitiDto,
    @RequestUser() user: AdminDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    createGramMahitiDto.panchayatId = user.panchayatId;

    createGramMahitiDto.extraFields = files.reduce((p, f) => {
      p[f.fieldname] = getFilePath(f.path);
      return p;
    }, createGramMahitiDto.extraFields);
    createGramMahitiDto.createdBy = user.name;
    return this.grammahitiService.create({
      ...createGramMahitiDto,
    });
  }

  @Get()
  find(@Query() query: GramMahitiQueryDto, @RequestUser() user: AdminDto) {
    query.panchayatId = user.panchayatId;
    console.log('GramMahitiQueryDto', query);
    return this.grammahitiService.find(query);
  }

  @Get('all')
  findAll(@Query() query: GramMahitiQueryDto, @RequestUser() user: AdminDto) {
    query.panchayatId = user.panchayatId;

    return this.grammahitiService.findAll(query);
  }

  @Get('tableheader')
  getTableHeaders(@Query('sectionId') sectionId: string) {
    console.log('query', sectionId);

    return this.grammahitiService.getTableHeaders(sectionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grammahitiService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor(multerOptions(mimeTypes.images)))
  update(
    @Body() updateGramMahitiDto: UpdateGramMahitiDto,
    @RequestUser() user: AdminDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    updateGramMahitiDto.panchayatId = user.panchayatId;

    updateGramMahitiDto.extraFields = files.reduce((p, f) => {
      p[f.fieldname] = getFilePath(f.path);
      return p;
    }, updateGramMahitiDto.extraFields);
    return this.grammahitiService.update({
      ...updateGramMahitiDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.grammahitiService.remove(id);
  }
}
