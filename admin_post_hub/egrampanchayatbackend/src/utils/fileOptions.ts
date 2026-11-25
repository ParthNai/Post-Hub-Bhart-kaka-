import { join } from 'path';
export const mimeTypes = {
  excel: /\/(csv|xlsx|xls|spreadsheetml)$/,
  apk: /\/(vnd.android.package-archive)$/,
  exe: 'application/x-msdownload',

  json: 'application/json',
  zip: 'application/zip',
  all: 'application/*',
  images: /image\/png|image\/jpeg|imagesvg\+xml|image\/gif|image\/webp/,
  txt: 'text/plain',
  pdf: [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'text/x-pdf',
  ],
};
export const getFilePath = (file: Express.Multer.File | string) => {
  // console.log("file path ", file.path, process.env.FILE_PATH);
  // const path = process.env.FILE_PATH || "";
  // console.log(file.path.replace(path, ""));
  // return file.path.split('/')

  // const absolutePath = getAbsoltesFilePath(file.path);

  // return absolutePath;
  const splittedPath =
    typeof file !== 'string' ? file.path.split('/') : file.split('/');
  // return file.path.split('/').slice()

  return splittedPath
    .splice(splittedPath.length - 4, splittedPath.length)
    .join('/');
  // return file.filename;
};

export const getAbsoltesFilePath = (filePath: string | undefined) => {
  const splittedPath = filePath.split('/');
  // return file.path.split('/').slice()

  return splittedPath
    .splice(splittedPath.length - 4, splittedPath.length)
    .join('/');
};
