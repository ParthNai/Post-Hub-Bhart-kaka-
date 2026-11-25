import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import * as moment from 'moment';
import { UserRequest } from 'src/commondto';
import { mimeTypes } from './fileOptions';
declare type CallBackTypefileFilter = (a: null | Error, b: boolean) => void;
declare type CallBackTypedestination = (a: null, b: string) => void;
const path = join(__dirname, '../../../', process.env.FILE_PATH);

// Multer configuration
export const multerConfig = {
  dest: path,
};
// console.log('multerConfig', multerConfig);
// Multer upload options

export const multerOptions = (
  mimetype: RegExp | any[] | Object | string | string[],
  customFileType?: string,
) => {
  const multerConfig = {
    dest: path,
  };
  return {
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: CallBackTypefileFilter,
    ) => {
      // console.log('file.fieldname:', file.fieldname);

      if (mimetype instanceof Object && mimetype instanceof RegExp === false) {
        const fileMimeType = mimetype[file.fieldname];
        // if (file.fieldname === 'paperPath') {
        //   console.log(
        //     'fileMimeType',

        //     // Object.keys(mimetype),
        //     Object.keys(mimetype)[1],
        //     file.fieldname,
        //     typeof Object.keys(mimetype)[1],
        //     Object.keys(mimetype)[1] === 'paperPath',
        //     typeof file.fieldname,

        //     // mimetype[Object.keys(mimetype)[1]],
        //     // fileMimeType,
        //   );
        // }

        validateFileMimeType({
          mimetype: fileMimeType,
          file,
          customFileType,
          cb,
        });
      } else {
        console.log('else type');
        validateFileMimeType({
          mimetype,
          file,
          customFileType,
          cb,
        });
      }
      // validateFileMimeType({ mimetype, file, customFileType, cb });
      // cb(null, false);
      // if (typeof mimetype === 'object') {
      //   console.log(
      //     'file',
      //     // file,
      //     mimetype,
      //     file.fieldname,
      //     mimetype[file.fieldname],
      //   );
      //   validateFileMimeType({
      //     mimetype: mimetype[file.fieldname],
      //     file,
      //     customFileType,
      //     cb,
      //   });
      // } else {
      //   validateFileMimeType({ mimetype, file, customFileType, cb });
      // }
      // if (!Array.isArray(mimetype)) {
      //   validateFileMimeType({ mimetype, file, customFileType, cb });
      // }
      // else {

      // }

      // console.log('file mimte', file.mimetype, file.mimetype.match(mimetype));
    },

    // Storage properties
    storage: diskStorage({
      // Destination storage path details
      destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: CallBackTypedestination,
      ) => {
        let mainFolder = 'egrampanchayat';
        const req = _req as unknown as UserRequest;
        if (req.user.panchayatId) {
          mainFolder = req.user.panchayatId;
        }
        let uploadFolder = '';
        if (
          mimetype instanceof Object &&
          mimetype instanceof RegExp === false
        ) {
          const mymimetype = mimetype[_file.fieldname];
          // console.log('array mime', mimetype);
          if (mymimetype === mimeTypes.pdf) {
            uploadFolder = '/pdfs';
          }
        }
        if (_file.mimetype.match(mimeTypes.excel)) {
          uploadFolder = '/csvs';
        }
        if (_file.mimetype.match(mimeTypes.apk)) {
          uploadFolder = '/apks';
        }
        if (_file.mimetype.match(mimeTypes.json)) {
          uploadFolder = '/jsons';
        }
        if (_file.mimetype.match(mimeTypes.zip)) {
          uploadFolder = '/zips';
        }
        if (_file.mimetype.match(mimeTypes.images)) {
          uploadFolder = '/images';
        }
        const uploadPath =
          multerConfig.dest +
          '/' +
          mainFolder +
          uploadFolder +
          '/' +
          moment().format(process.env.FILE_FOLDER_DATE_FORMAT);
        // Create folder if doesn't exist
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, {
            recursive: true,
          });
        }
        cb(null, uploadPath);
      },
      // File modification details
      filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: CallBackTypedestination,
      ) => {
        if (!_req.body.createdBy && _req.method === 'POST') {
          _req.body.createdBy = _req.headers.createdBy;
        }
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
  };
};

const validateFileMimeType = ({ mimetype, file, customFileType, cb }) => {
  // console.log('validateFileMimeType', mimetype);
  if (Array.isArray(mimetype)) {
    if (mimetype.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(
            file.originalname,
          )}. Please upload a valid file`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  } else if (mimetype && file.mimetype.match(mimetype)) {
    cb(null, true);
  } else if (customFileType && mimeTypes && file.mimetype === customFileType) {
    cb(null, true);
  } else {
    cb(
      new HttpException(
        `Unsupported file type ${extname(
          file.originalname,
        )}. Please upload a ${mimetype} file`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
};

export const generateFileFolderPath = (
  req: UserRequest,
  uploadFolder: string,
) => {
  const path = join(__dirname, '../../../', process.env.FILE_PATH);

  let mainFolder = 'egrampanchayat';
  if (req.user.panchayatId) {
    mainFolder = req.user.panchayatId;
  }

  const uploadPath =
    path +
    '/' +
    mainFolder +
    '/' +
    uploadFolder +
    '/' +
    moment().format(process.env.FILE_FOLDER_DATE_FORMAT);
  // Create folder if doesn't exist
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, {
      recursive: true,
    });
  }
  return uploadPath;
};

// import { extname, join } from 'path';
// import { existsSync, mkdirSync } from 'fs';
// import { diskStorage } from 'multer';
// import { v4 as uuid } from 'uuid';
// import { HttpException, HttpStatus } from '@nestjs/common';
// import { Request } from 'express';
// import { mimeTypes } from './fileOptions';
// import { UserRequest } from 'src/commondto';
// declare type CallBackTypefileFilter = (a: null | Error, b: boolean) => void;
// declare type CallBackTypedestination = (a: null, b: string) => void;
// const path = join(process.cwd(), '../', `${process.env.FILE_PATH}`);

// // Multer configuration
// // export const multerConfig = {
// //   dest: path,
// // };
// // Multer upload options
// export const multerOptions = (
//   mimetype?: string | RegExp,
//   customFileType?: string,
// ) => {
//   return {
//     fileFilter: (
//       _req: Request,
//       file: Express.Multer.File,
//       cb: CallBackTypefileFilter,
//     ) => {
//       console.log('file mimte', file.mimetype, file.mimetype.match(mimetype));
//       if (mimetype && file.mimetype.match(mimetype)) {
//         cb(null, true);
//       } else if (
//         customFileType &&
//         mimetype &&
//         file.mimetype === customFileType
//       ) {
//         cb(null, true);
//       } else if (!mimetype) {
//         cb(null, true);
//       } else {
//         cb(
//           new HttpException(
//             `Unsupported file type ${extname(
//               file.originalname,
//             )}. Please upload a ${mimetype} file`,
//             HttpStatus.BAD_REQUEST,
//           ),
//           false,
//         );
//       }
//     },

//     // Storage properties
//     storage: diskStorage({
//       // Destination storage path details
//       destination: (
//         _req: Request,
//         _file: Express.Multer.File,
//         cb: CallBackTypedestination,
//       ) => {
//         const uploadPath = generateFilePath(
//           _file,
//           _req as unknown as UserRequest,
//         );
//         console.log('uploadpath', uploadPath);

//         cb(null, _file.path);
//       },
//       // File modification details
//       filename: (
//         _req: Request,
//         file: Express.Multer.File,
//         cb: CallBackTypedestination,
//       ) => {
//         const req = _req as unknown as UserRequest;
//         console.log(
//           '_req.headers.createdBy',
//           (_req as unknown as UserRequest).user,
//         );
//         if (!_req.body.createdBy && _req.method === 'POST') {
//           _req.body.createdBy = _req.headers.createdBy;
//         }
//         let mainFolderPath = 'pariksharth';
//         // console.log('req', req.user);
//         if (req.user.panchayatId) {
//           mainFolderPath = req.user.instituteName;
//         }
//         const subFolder = generateFilePath(
//           file,
//           _req as unknown as UserRequest,
//         );
//         const filePath = join(mainFolderPath, subFolder);

//         console.log('callback path', filePath);
//         cb(null, join(filePath, `${uuid()}${extname(file.originalname)}`));
//       },
//     }),
//   };
// };

// export const generateFilePath = (
//   _file: Express.Multer.File,
//   req: UserRequest,
// ) => {
//   let mainFolderPath = 'pariksharth';
//   // console.log('req', req.user);
//   if (req.user.panchayatId) {
//     mainFolderPath = req.user.instituteName;
//   }

//   let uploadFolder = '';
//   if (_file.mimetype.match(mimeTypes.excel)) {
//     uploadFolder = '/csvs';
//   }
//   if (_file.mimetype.match(mimeTypes.apk)) {
//     uploadFolder = '/apks';
//   }
//   if (_file.mimetype.match(mimeTypes.json)) {
//     uploadFolder = '/jsons';
//   }
//   if (_file.mimetype.match(mimeTypes.zip)) {
//     uploadFolder = '/zips';
//   }
//   if (_file.mimetype.match(mimeTypes.images)) {
//     uploadFolder = '/images';
//   }
//   const uploadPath = join(path, mainFolderPath, uploadFolder);
//   // console.log('uploadPath', uploadPath);
//   // Create folder if doesn't exist
//   if (!existsSync(uploadPath)) {
//     mkdirSync(uploadPath, {
//       recursive: true,
//     });
//   }
//   return uploadPath;
// };
