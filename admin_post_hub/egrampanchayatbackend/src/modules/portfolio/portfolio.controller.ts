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
import { PortfolioService } from './portfolio.service';
import {
  CreatePortfolioDto,
  PortfolioQueryDto,
  UpdatePortfolioDto,
} from './dto/portfolio.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.portfolioService.create({
      ...createPortfolioDto,
      image: getFilePath(file),
    });
  }

  @Get()
  find(@Query() query: PortfolioQueryDto) {
    console.log('query', query);
    return this.portfolioService.find(query);
  }

  @Get('all')
  findAll(@Query() query: PortfolioQueryDto) {
    return this.portfolioService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  @Patch()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions(mimeTypes.images)))
  update(
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.portfolioService.update({
      ...updatePortfolioDto,
      ...(file && {
        image: getFilePath(file),
      }),
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.portfolioService.remove(id);
  }
}
