import { Module } from '@nestjs/common';
import { FilehostService } from './filehost.service';
import { FilehostController } from './filehost.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { mimeTypes } from 'src/utils/fileOptions';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
@Module({
  imports: [ConfigModule],
  controllers: [FilehostController],
  providers: [FilehostService],
})
export class FilehostModule {}

export const FileHostMulterModule = MulterModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = generateFilePath(file, configService);
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueFileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Example: Only allow images (png, jpg, jpeg)
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Unsupported file type ${extname(
              file.originalname,
            )}. Please upload an image.`,
          ),
          false,
        );
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB file size limit
    },
  }),
  inject: [ConfigService],
});

interface GenereateFilePath {
  _req: Request;
  _file: Express.Multer.File;
}
const generateFilePath = (
  file: Express.Multer.File,
  configService: ConfigService,
) => {
  let uploadFolder = '';

  if (file.mimetype.match(mimeTypes.excel)) {
    uploadFolder = '/csvs';
  }
  if (file.mimetype.match(mimeTypes.apk)) {
    uploadFolder = '/apks';
  }
  if (file.mimetype.match(mimeTypes.json)) {
    uploadFolder = '/jsons';
  }
  if (file.mimetype.match(mimeTypes.zip)) {
    uploadFolder = '/zips';
  }
  if (file.mimetype.match(mimeTypes.images)) {
    uploadFolder = '/images';
  }

  const baseUploadPath = configService.get<string>('FILE_PATH') || './uploads';
  const uploadPath = `${baseUploadPath}${uploadFolder}}`;

  // Ensure the directory exists
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};
