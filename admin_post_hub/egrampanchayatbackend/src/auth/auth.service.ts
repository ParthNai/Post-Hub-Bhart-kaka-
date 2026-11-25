import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from 'src/admins/schema/admins.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { SmsService } from './sms.service';
import { encrypt } from 'src/utils/ecryptionUtils';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Admin.name) private admins: Model<Admin>,
    @InjectModel(Panchayat.name) private panchayat: Model<Panchayat>,

    private readonly smsService: SmsService,
  ) {}

  async signIn(data: LoginDto) {
    console.log('data', data);

    const user = await this.admins.findOne({ mobile: data.mobile });

    console.log('user', user);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      _id: user._id,
      name: user.name,
      panchayatId: user.panchayatId,
      roles: user.role,
      mobile: user.mobile,
    };

    const secretToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    console.log('secretToken', secretToken);
    let panchayat = null;
    if (user.panchayatId) {
      panchayat = await this.panchayat.findById(user.panchayatId);
    }
    return {
      status: HttpStatus.OK,

      messsage: 'Login verified successfully',
      accessToken: secretToken,
      user,
      panchayat,
    };
  }
  // async sendLoginOtp(mobile: string) {
  //   // async sendOtp(mobile: number, otp: string): Promise<object> {
  //   console.log('send Login otp', mobile);
  //   try {
  //     const findAdminId = await this.admins.findOne({
  //       mobile: mobile,
  //     });
  //     if (!findAdminId) {
  //       throw new NotFoundException('Admin Not Found');
  //     }

  //     const apiKey = process.env.SMS_API_KEY;
  //     const senderId = process.env.SMS_SENDER_ID;
  //     // const apiKey = config.get.SMS_API_KEY;
  //     // const senderId = process.env.SMS_SENDER_ID;

  //     const response = await this.httpService
  //       .get(
  //         // `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/${senderId}`,
  //         `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/AUTOGEN/${senderId}`,

  //         // `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/AUTOGEN`,
  //       )
  //       .toPromise();

  //     console.log(response.data);

  //     return { sessionId: response.data.Details, adminId: findAdminId._id };
  //     // return { status: HttpStatus.OK, data: response.data };
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // async verifyLoginOtp({ sessionId, otp, adminId }: VerifyOtpAdmin) {
  //   try {
  //     const user = await this.admins.findById(adminId);
  //     if (!user) {
  //       throw new NotFoundException('Account does not exist');
  //     }
  //     const apiKey = process.env.SMS_API_KEY;
  //     const response = await this.httpService
  //       .get(
  //         // `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
  //         `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`, // for autogen
  //       )
  //       .toPromise();

  //     console.log('response', response.data);

  //     const returnData = response.data;
  //     if (response.status === 200) {
  //       const payload = {
  //         _id: user._id,
  //         name: user.name,
  //         panchayatId: user.panchayatId,
  //         roles: user.roles,
  //         activeRole: user.activeRole,
  //         mobile: user.mobile,
  //       };

  //       const secretToken = encrypt({
  //         text: await this.jwtService.signAsync(payload, {
  //           secret: this.configService.get('JWT_SECRET'),
  //         }),
  //         secretKey: this.configService.get('JWT_ENCRYPTION_KEY'),
  //         iv: this.configService.get('JWT_IV'),
  //       });
  //       return {
  //         status: HttpStatus.OK,

  //         messsage: 'Login verified successfully',
  //         accessToken: secretToken,
  //         user,
  //       };

  //       // return {
  //       //   status: HttpStatus.OK,
  //       //   ...returnData,
  //       //   student: student,
  //       // };
  //     }

  //     return {
  //       status: HttpStatus.OK,
  //       ...returnData,
  //       messsage: 'Admin verified successfully',
  //     };
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async getDetails(panchayatId: string) {
    const foundUser = await this.admins.findById(panchayatId);

    let panchayat = null;
    if (foundUser.panchayatId) {
      panchayat = await this.panchayat.findById(foundUser.panchayatId);
    }
    if (!foundUser.isActive) {
      throw new ForbiddenException('Inactive user, Please contact admin.');
    }
    return { user: foundUser, panchayat };
  }
}
