import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { FilehostService } from './filehost.service';
import type { Response } from 'express';
@Public()
@Controller('uploads')
export class FilehostController {
  constructor(private readonly filehostService: FilehostService) {}

  @Get()
  findAll(@Query('url') url: string, @Res() res: Response) {
    // console.log('url', url);
    const file = this.filehostService.findAll(url);

    return file.pipe(res);
  }
}
