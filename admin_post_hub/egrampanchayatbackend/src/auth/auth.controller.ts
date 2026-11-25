import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, RequestUser } from './auth.decorator';
import { AuthService } from './auth.service';
import {
  ActiveRoleDto,
  GetLoginOtp,
  LoginDto,
  VerifyOtpAdmin,
} from './dto/auth.dto';
import { AdminDto } from 'src/admins/dto/admins.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async create(@Body() loginData: LoginDto) {
    return await this.authService.signIn(loginData);
  }

  // @Public()
  // @Post('getLoginOtp')
  // async getLoginOtp(@Body() loginData: GetLoginOtp) {
  //   return await this.authService.sendLoginOtp(loginData.mobile);
  // }
  // @Public()
  // @Post('login')
  // async create(@Body() loginData: VerifyOtpAdmin) {
  //   return await this.authService.verifyLoginOtp(loginData);
  // }

  // @Post('activeRole')
  // async setActiveRole(@Body() roleData: ActiveRoleDto) {
  //   return await this.authService.setActiveRole(roleData);
  // }

  @Get('details/token')
  async getUserByToken(@RequestUser() user: AdminDto) {
    // const user = request['user'];
    console.log('user', user);
    return await this.authService.getDetails(user._id);
  }
}
