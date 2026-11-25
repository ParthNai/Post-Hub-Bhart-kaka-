import { HttpService } from '@nestjs/axios';
import {
  SendLoginOtpResponseDto,
  SentLoginOtpDto,
  VerifyOtpDto,
} from './dto/sms.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SmsService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendOtp(data: SentLoginOtpDto): Promise<SendLoginOtpResponseDto> {
    const senderId = this.configService.get('SMS_SENDER_ID');
    const apiKey = this.configService.get('SMS_API_KEY');
    //
    const mobile = data.mobile;

    try {
      const isSMSENABLED = this.configService.get('ENABLE_SMS') === 'true';
      console.log('isSMSENABLED', isSMSENABLED);

      if (Boolean(isSMSENABLED)) {
        const response = await this.httpService.axiosRef
          .get(
            `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/AUTOGEN/${senderId}`,
          )
          .then((res) => res.data)
          .catch((Err) => {
            throw new InternalServerErrorException('Failed to send otp');
          });
        return { sessionId: response.Details };
      } else {
        return { sessionId: '111' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send otp');
    }
  }

  async verifyOtp(data: VerifyOtpDto) {
    const senderId = this.configService.get('SMS_SENDER_ID');
    const apiKey = this.configService.get('SMS_API_KEY');

    const { sessionId, otp } = data;
    const isSMSENABLED = this.configService.get('ENABLE_SMS') === 'true';

    console.log('isSMSENABLED', Boolean(isSMSENABLED));
    try {
      if (Boolean(isSMSENABLED)) {
        const response = await this.httpService.axiosRef
          .get(
            `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
          )
          .then((res) => res.data)
          .catch((Err) => {
            throw new BadRequestException(Err.response.data.Details);
          });
        if (response.Status !== 'Success') {
          throw new BadRequestException(response.Details);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
