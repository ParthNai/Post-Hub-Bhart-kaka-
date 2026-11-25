import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  isMobilePhone,
  IsMobilePhone,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginDto {
  // @IsNumber()
  @ApiProperty()
  mobile: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class GetLoginOtp {
  @IsMobilePhone()
  @ApiProperty()
  mobile: string;
}

@Expose()
export class VerifyOtpAdmin {
  @ApiProperty()
  adminId: string;

  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  otp: string;
}

export class SendOTPResponseDTO {
  @ApiProperty()
  Details: string;

  @ApiProperty()
  Status: string;
}

export class ActiveRoleDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  newActiveRole: string;
}
export enum ILoginType {
  REGULAR = 'REGULAR',
  TEMPORARY = 'TEMPORARY',
}
