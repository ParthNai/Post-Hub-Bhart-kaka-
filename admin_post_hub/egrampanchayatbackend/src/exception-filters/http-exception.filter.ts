import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import * as fs from 'fs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const contentType = request.headers['content-type'];
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * @description Exception json response
     * @param message
     */

    console.log('error', exception);
    const getMessage = (exception) => {
      if (exception.response?.message) {
        if (Array.isArray(exception.response?.message)) {
          // return exception.response?.message.join(' / ')
          return exception.response?.message;
        } else {
          return exception.response?.message;
        }
      } else {
        return exception.message;
      }
    };
    if (
      status === HttpStatus.BAD_REQUEST &&
      contentType &&
      contentType.includes('multipart/form-data')
    ) {
      this.deleteFileOnBadRequest(request.files || request.file);
    }
    const responseMessage = (type, message) => {
      response.status(status).json({
        status: status,
        path: request.url,
        error: type,
        errorMessage: exception.cause,
        message: getMessage(exception),
      });
    };

    if (exception.message) {
      responseMessage('Error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }

  deleteFileOnBadRequest(files: Express.Multer.File[] | Express.Multer.File) {
    const getFiles = (
      files: Express.Multer.File[] | Express.Multer.File | unknown | undefined,
    ) => {
      if (!files) return [];
      if (isArray(files)) return files;
      return [files];
    };

    const filePaths = getFiles(files);

    for (const file of filePaths) {
      try {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(err);
            return err;
          }
        });
      } catch (error) {}
    }
  }
}

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     const status = exception.getStatus();
//     const responseError = exception.getResponse();
//     console.log('exception', exception);
//     response.status(status).json({
//       status: status,
//       message: exception.message,
//       path: request.url,
//       error: responseError,
//     });
//   }
// }
