import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import {
  CreateGalleryDto,
  GalleryQueryDto,
  UpdateGalleryDto,
} from './dto/gallery.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { GalleryService } from './gallery.service';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: 100 }],
      multerOptions({ images: mimeTypes.images }),
    ),
  )
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createGalleryDto.panchayatId = user.panchayatId;
    }
    return this.galleryService.create({
      ...createGalleryDto,
      images: files.images.map((d) => getFilePath(d)),
    });
  }

  @Get()
  find(@Query() query: GalleryQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) {
      query.panchayatId = user.panchayatId;
    }
    console.log('query', query);
    return this.galleryService.find(query);
  }

  @Get('all')
  findAll(@Query() query: GalleryQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) {
      query.panchayatId = user.panchayatId;
    }
    return this.galleryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images', maxCount: 100 }],
      multerOptions({ images: mimeTypes.images }),
    ),
  )
  update(
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      updateGalleryDto.panchayatId = user.panchayatId;
    }
    return this.galleryService.update({
      ...updateGalleryDto,

      images:
        files?.images?.length > 0
          ? files?.images?.map((d) => getFilePath(d))
          : [],
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.galleryService.remove(id);
  }
}
