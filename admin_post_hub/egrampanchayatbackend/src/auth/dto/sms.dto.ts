export class SentLoginOtpDto {
  mobile: string;
}

export class SendLoginOtpResponseDto {
  sessionId: string;
}

export class VerifyOtpResponseDto {
  sessionId: string;
}

export class VerifyOtpDto {
  otp: string;
  sessionId: string;
}
