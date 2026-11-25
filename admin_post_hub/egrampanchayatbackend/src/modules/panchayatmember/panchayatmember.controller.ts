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
import { PanchayatMemberService } from './panchayatmember.service';
import {
  CreatePanchayatMemberDto,
  PanchayatMemberQueryDto,
  UpdatePanchayatMemberDto,
} from './dto/panchayatmember.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { RequestUser } from 'src/auth/auth.decorator';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('panchayatmember')
@Controller('panchayatmember')
export class PanchayatMemberController {
  constructor(
    private readonly panchayatmemberService: PanchayatMemberService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createPanchayatMemberDto: CreatePanchayatMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    createPanchayatMemberDto.panchayatId = user.panchayatId;
    return this.panchayatmemberService.create({
      ...createPanchayatMemberDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: PanchayatMemberQueryDto, @RequestUser() user: AdminDto) {
    console.log('query', query);
    query.panchayatId = user.panchayatId;
    return this.panchayatmemberService.find(query);
  }

  @Get('all')
  findAll(@Query() query: PanchayatMemberQueryDto) {
    return this.panchayatmemberService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panchayatmemberService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updatePanchayatMemberDto: UpdatePanchayatMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: AdminDto,
  ) {
    updatePanchayatMemberDto.panchayatId = user.panchayatId;

    return this.panchayatmemberService.update({
      ...updatePanchayatMemberDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.panchayatmemberService.remove(id);
  }
}
