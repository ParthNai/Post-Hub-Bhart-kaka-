import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const IS_PARTIAL_PUBLIC_KEY = 'isPartialPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const PartialPublic = () => SetMetadata(IS_PARTIAL_PUBLIC_KEY, true);

// Define the custom decorator function
export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // console.log('user role decorator');
    // Extract user data from the request object as needed
    return request.user.activeRole; // Assuming user data is stored in request.user
  },
);

export const Userpanchayat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // console.log('user role decorator');
    // Extract user data from the request object as needed
    return request.user.panchayatId; // Assuming user data is stored in request.user
  },
);

export const UserPermissions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // console.log('user role decorator');
    // Extract user data from the request object as needed
    return request.user.permissions; // Assuming user data is stored in request.user
  },
);
export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log('request', request.user);
    // console.log('user role decorator');
    // Extract user data from the request object as needed
    return request.user; // Assuming user data is stored in request.user
  },
);
