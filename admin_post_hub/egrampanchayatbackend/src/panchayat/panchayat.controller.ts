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
import { PanchayatService } from './panchayat.service';
import {
  CreatePanchayatDto,
  PanchayatQueryDto,
  UpdatePanchayatDto,
} from './dto/panchayat.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('panchayat')
@Controller('panchayat')
export class PanchayatController {
  constructor(private readonly panchayatService: PanchayatService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logoPath', multerOptions(mimeTypes.images)))
  create(
    @Body() createPanchayatDto: CreatePanchayatDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.panchayatService.create({
      ...createPanchayatDto,
      logoPath: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: PanchayatQueryDto) {
    console.log('query', query);
    return this.panchayatService.find(query);
  }

  @Get('all')
  findAll(@Query() query: PanchayatQueryDto) {
    return this.panchayatService.findAll(Query);
  }
  @Get('my')
  gtMy(@RequestUser() user: AdminDto) {
    return this.panchayatService.findOne(user.panchayatId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panchayatService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logoPath', multerOptions(mimeTypes.images)))
  update(
    @Body() updatePanchayatDto: UpdatePanchayatDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('updatePanchayatDto', updatePanchayatDto);
    return this.panchayatService.update({
      ...updatePanchayatDto,
      ...(file && {
        logoPath: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.panchayatService.remove(id);
  }
}
