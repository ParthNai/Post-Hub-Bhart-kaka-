import {
  CanActivate,
  ExecutionContext,
  Injectable,
  RequestMethod,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PARTIAL_PUBLIC_KEY, IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPartialPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PARTIAL_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    // request.body.createdBy ='Harsh'
    // request.headers.createdBy ='Harsh'

    // return true

    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const encToken = extractTokenFromHeader(request);
    if (!encToken && !isPartialPublic) {
      throw new UnauthorizedException();
    }
    try {
      if (isPartialPublic && !encToken) {
        return true;
      }
      const token = encToken;

      // console.log('token', token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;

      if (!request.body) {
        request.body = {};
      }

      if (!request.body?.createdBy) {
        request.body['createdBy'] = request['user'].name;
      }

      request.headers.createdBy = request['user'].name;
      if (
        request['user'].instituteId &&
        contentType !== 'multipart/form-data'
      ) {
        request.headers['instituteId'] = request['user'].instituteId;

        if (request.method === 'GET') {
          request.query.instituteId = request['user'].instituteId;
          request.query.activeRole = request['user'].activeRole;
        }

        if (request.method === 'POST') {
          request.body.instituteId = request['user'].instituteId;
          request.body.userActiveRole = request['user'].activeRole;
        }
      }
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException(error);
    }
    return true;
  }
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
