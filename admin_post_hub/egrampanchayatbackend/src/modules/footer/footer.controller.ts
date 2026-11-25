import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { FooterService } from './footer.service';
import {
  AllFooterQueryDto,
  CreateFooterDto,
  FooterQueryDto,
  UpdateFooterDto,
} from './dto/footer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('footer')
@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Post()
  create(@Body() createFooterDto: CreateFooterDto) {
    return this.footerService.create({
      ...createFooterDto,
    });
  }

  @Get()
  find(@Query() query: FooterQueryDto) {
    console.log('query', query);
    return this.footerService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllFooterQueryDto) {
    return this.footerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.footerService.findOne(id);
  }

  @Patch()
  update(@Body() updateFooterDto: UpdateFooterDto) {
    return this.footerService.update({
      ...updateFooterDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.footerService.remove(id);
  }
}
