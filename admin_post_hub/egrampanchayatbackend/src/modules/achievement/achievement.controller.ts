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
import { AchievementService } from './achievement.service';
import {
  CreateAchievementDto,
  AchievementQueryDto,
  UpdateAchievementDto,
} from './dto/achievement.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { AdminDto } from 'src/admins/dto/admins.dto';
import { RequestUser } from 'src/auth/auth.decorator';

@ApiTags('achievement')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createAchievementDto: CreateAchievementDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      createAchievementDto.panchayatId = user.panchayatId;
    }
    return this.achievementService.create({
      ...createAchievementDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: AchievementQueryDto, @RequestUser() user: AdminDto) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.achievementService.find(query);
  }

  @Get('all')
  findAll(
    @Query() query: AchievementQueryDto,

    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) query.panchayatId = user.panchayatId;

    return this.achievementService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updateAchievementDto: UpdateAchievementDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    if (user.panchayatId) {
      updateAchievementDto.panchayatId = user.panchayatId;
    }
    return this.achievementService.update({
      ...updateAchievementDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.achievementService.remove(id);
  }
}
