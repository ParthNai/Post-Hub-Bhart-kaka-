import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
} from '@nestjs/common';
import { AppApisService } from './app-apis.service';

import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFilePath, mimeTypes } from 'src/utils/fileOptions';
import { multerOptions } from 'src/utils/multerOptions';
import { Public } from 'src/auth/auth.decorator';
import {
  GetGramQuery,
  GetSchemeByIdQuery,
  GetSchemeByCategoryNameQuery,
  GetTalakaQuery,
  AddSuggestionDto,
} from './dto/app-apis.dto';
import { CreatePanchayatRequestDto } from 'src/modules/panchayatrequest/dto/panchayatrequest.dto';
import { CreateContactRequestDto } from 'src/modules/contactrequest/dto/contactrequest.dto';
import { CreateUserComplaintDto } from 'src/modules/usercomplaint/dto/usercomplaint.dto';

@ApiTags('app')
@Controller('app')
export class AppApisController {
  constructor(private readonly apiService: AppApisService) {}

  @Get('navbar/:language')
  @Public()
  async getNavData(@Param('language') language: string) {
    return await this.apiService.getNavData(language);
  }

  @Get('gramNavbar/:panchayatId/:language')
  @Public()
  async gramNavbar(@Param('panchayatId') panchayatId: string) {
    return await this.apiService.gramNavbar(panchayatId);
  }

  @Get('getGramId/:panchayatName')
  @Public()
  async getGramByName(@Param('panchayatName') panchayatName: string) {
    console.log('get Gram');
    return await this.apiService.getGramByName(panchayatName);
  }

  @Get('home/:language')
  @Public()
  async getHomeData(@Param('language') language: string) {
    await this.apiService.increaseVisior();
    return await this.apiService.getHomeData(language);
  }

  @Get('gramHome/:panchayatId/:language')
  @Public()
  async getGramHomeData(@Param('panchayatId') panchayatId: string) {
    await this.apiService.increaseVisior();

    return await this.apiService.getGramHomeData(panchayatId);
  }

  @Get('gettaluka/:districtName/:language')
  @Public()
  async getTaluka(@Param() query: GetTalakaQuery) {
    return await this.apiService.getTaluka(query);
  }
  @Get('getgram/:talukaName/:language')
  @Public()
  async getGram(@Param() query: GetGramQuery) {
    return await this.apiService.getGram(query);
  }

  @Get('about/:panchayatId/:language')
  @Public()
  async getAbout(@Param('panchayatId') panchayatId: string) {
    return await this.apiService.getAbout(panchayatId);
  }

  @Get('scheme/:language')
  @Public()
  async getSchemes(@Param('language') language: string) {
    return await this.apiService.getSchemes(language);
  }

  @Get('schemeById/:schemeId/:language')
  @Public()
  async getSchemeById(@Param() params: GetSchemeByIdQuery) {
    return await this.apiService.getSchemeById(params);
  }

  @Get('schemeByCategory/:categoryName/:language')
  @Public()
  async getSchemeByCategory(@Param() params: GetSchemeByCategoryNameQuery) {
    return await this.apiService.getSchemeByCategoryName(params);
  }

  @Get('form/:language')
  @Public()
  async getForms(@Param('language') language: string) {
    return await this.apiService.getForms(language);
  }

  @Get('formById/:formId/:language')
  @Public()
  async getFormById(@Param('formId') formId: string) {
    return await this.apiService.getFormById(formId);
  }

  @Get('achievement/:achievementId/:language')
  @Public()
  async getAchievementById(@Param('achievementId') achievementId: string) {
    return await this.apiService.getAchievementById(achievementId);
  }

  @Get('gallery/:panchayatId/:language')
  @Public()
  async getgallery(@Param('panchayatId') panchayatId: string) {
    console.log('ehehe');
    return await this.apiService.getgallery(panchayatId);
  }

  @Get('gramContact/:panchayatId/:language')
  @Public()
  async gramContact(@Param('panchayatId') panchayatId: string) {
    // console.log('ehehe');
    console.log('gramContact');
    return await this.apiService.gramContact(panchayatId);
  }

  @Get('gramInfo/:sectionId/:panchayatId/:language')
  @Public()
  async getGramInfo(
    @Param('sectionId') sectionId: string,
    @Param('panchayatId') panchayatId: string,
  ) {
    return await this.apiService.getGramInfo(sectionId, panchayatId);
  }

  @Get('gramMember/:panchayatId/:language')
  @Public()
  async gramMember(@Param('panchayatId') panchayatId: string) {
    // console.log('ehehe');
    console.log('gramMember');
    return await this.apiService.gramMember(panchayatId);
  }

  @Get('searchgram/:gramName/:language')
  @Public()
  async searchGram(@Param('gramName') panchayatId: string) {
    return await this.apiService.searchGram(panchayatId);
  }
  @Post('addPanchayat')
  @Public()
  async panchayatRequest(@Body() data: CreatePanchayatRequestDto) {
    return await this.apiService.panchayatRequest(data);
  }
  @Post('addsuggestion')
  @Public()
  async addSuggestion(@Body() data: AddSuggestionDto) {
    return await this.apiService.addSuggestion(data);
  }

  @Post('addcontactrequest')
  @Public()
  async addContactRequest(@Body() data: CreateContactRequestDto) {
    return await this.apiService.addContactRequest(data);
  }

  @Post('addComplain')
  @Public()
  async addComplaint(@Body() data: CreateUserComplaintDto) {
    return await this.apiService.addComplaint(data);
  }
}
