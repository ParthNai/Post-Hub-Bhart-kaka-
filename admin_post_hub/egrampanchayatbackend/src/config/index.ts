import { ConfigModule as nCM } from '@nestjs/config';
import * as path from 'path';

export const ConfigModule = nCM.forRoot({
  envFilePath:
    // process.env.CONFIG_FILE_PATH ||
    // path.join(__dirname, '../../config/dev.env'),
    path.join(
      __dirname,
      `../../config/.env.${
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
      }`,
    ),
});
