import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilehostService {
  constructor(private config: ConfigService) {}
  findAll(url: string) {
    try {
      // console.log('url', Object.keys(url));
      const filePath = join(
        process.cwd(),
        '../',
        this.config.get('FILE_PATH'),
        url,
      );
      // console.log(filePath, 'filePath');
      const isExist = existsSync(filePath);
      if (!isExist) {
        throw new NotFoundException('File not found');
        // return
      }
      const file = createReadStream(filePath);
      return file;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
