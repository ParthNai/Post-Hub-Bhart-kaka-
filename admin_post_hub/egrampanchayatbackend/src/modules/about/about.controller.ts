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
import { AboutService } from './about.service';
import { CreateAboutDto, AboutQueryDto, UpdateAboutDto } from './dto/about.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createAboutDto: CreateAboutDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createAboutDto.panchayatId = user.panchayatId;
    }
    return this.aboutService.create({
      ...createAboutDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: AboutQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.aboutService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AboutQueryDto) {
    return this.aboutService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateAboutDto: UpdateAboutDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) updateAboutDto.panchayatId = user.panchayatId;

    return this.aboutService.update({
      ...updateAboutDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.aboutService.remove(id);
  }
}
