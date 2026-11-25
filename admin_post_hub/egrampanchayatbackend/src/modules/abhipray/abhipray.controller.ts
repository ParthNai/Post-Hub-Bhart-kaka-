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
import { AbhiprayService } from './abhipray.service';
import {
  CreateAbhiprayDto,
  AbhiprayQueryDto,
  UpdateAbhiprayDto,
} from './dto/abhipray.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('abhipray')
@Controller('abhipray')
export class AbhiprayController {
  constructor(private readonly abhiprayService: AbhiprayService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createAbhiprayDto: CreateAbhiprayDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createAbhiprayDto.panchayatId = user.panchayatId;
    }
    return this.abhiprayService.create({
      ...createAbhiprayDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: AbhiprayQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;
    return this.abhiprayService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AbhiprayQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;
    return this.abhiprayService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abhiprayService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateAbhiprayDto: UpdateAbhiprayDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      updateAbhiprayDto.panchayatId = user.panchayatId;
    }
    return this.abhiprayService.update({
      ...updateAbhiprayDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.abhiprayService.remove(id);
  }
}
