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
import { SliderService } from './slider.service';
import {
  CreateSliderDto,
  SliderQueryDto,
  UpdateSliderDto,
} from './dto/slider.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('slider')
@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createSliderDto.panchayatId = user.panchayatId;
    }
    return this.sliderService.create({
      ...createSliderDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: SliderQueryDto, @RequestUser() user: AdminDto) {
    console.log('query', query);
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.sliderService.find(query);
  }

  @Get('all')
  findAll(@Query() query: SliderQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.sliderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sliderService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('updateSliderDto', updateSliderDto);
    return this.sliderService.update({
      ...updateSliderDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.sliderService.remove(id);
  }
}
