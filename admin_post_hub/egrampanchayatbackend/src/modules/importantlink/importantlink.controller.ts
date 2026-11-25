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
import { ImportantLinkService } from './importantlink.service';
import {
  CreateImportantLinkDto,
  ImportantLinkQueryDto,
  UpdateImportantLinkDto,
} from './dto/importantlink.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('importantlink')
@Controller('importantlink')
export class ImportantLinkController {
  constructor(private readonly importantLinkService: ImportantLinkService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createImportantLinkDto: CreateImportantLinkDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createImportantLinkDto.panchayatId = user.panchayatId;
    }
    return this.importantLinkService.create({
      ...createImportantLinkDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: ImportantLinkQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.importantLinkService.find(query);
  }

  @Get('all')
  findAll(
    @Query() query: ImportantLinkQueryDto,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.importantLinkService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importantLinkService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateImportantLinkDto: UpdateImportantLinkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('updateImportantLinkDto', updateImportantLinkDto);
    return this.importantLinkService.update({
      ...updateImportantLinkDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.importantLinkService.remove(id);
  }
}
