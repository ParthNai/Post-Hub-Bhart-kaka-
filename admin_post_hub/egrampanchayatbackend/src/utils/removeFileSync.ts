import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

const path = process.env.FILE_PATH || join(__dirname, '../../', 'uploads');

export const removeFileSync = (file?: string) => {
  if (file) {
    const filePath = join(path, file);

    console.log('filePath', filePath);
    const isExist = existsSync(filePath);

    if (isExist) {
      unlinkSync(filePath);
    }
  }
};
