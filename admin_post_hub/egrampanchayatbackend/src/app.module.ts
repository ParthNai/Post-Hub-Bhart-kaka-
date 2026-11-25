import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './exception-filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AdminsModule } from './admins/admins.module';
import { PanchayatModule } from './panchayat/panchayat.module';
import { DashboardreportsModule } from './dashboardreports/dashboardreports.module';
import { AppApisModule } from './app-apis/app-apis.module';
import { DistrictModule } from './modules/district/district.module';
import { TalukaModule } from './modules/taluka/taluka.module';
import { SliderModule } from './modules/slider/slider.module';
import { FilehostModule } from './filehost/filehost.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { HeaderModule } from './modules/header/header.module';
import { FooterModule } from './modules/footer/footer.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { AbhiprayModule } from './modules/abhipray/abhipray.module';
import { AboutModule } from './modules/about/about.module';
import { ServiceModule } from './modules/service/service.module';
import { SchemeModule } from './modules/scheme/scheme.module';
import { NewsModule } from './modules/news/news.module';
import { FormModule } from './modules/form/form.module';
import { ImportantLinkModule } from './modules/importantlink/importantlink.module';
import { UserAbhiprayModule } from './modules/userabhipray/userabhipray.module';
import { PanchayatRequestModule } from './modules/panchayatrequest/panchayatrequest.module';
import { ContactRequestModule } from './modules/contactrequest/contactrequest.module';
import { UserComplaintModule } from './modules/usercomplaint/usercomplaint.module';
import { TableSection } from './modules/tablesection/schema/tablesection.schema';
import { PanchayatMemberModule } from './modules/panchayatmember/panchayatmember.module';
import { TableSectionModule } from './modules/tablesection/tablesection.module';
import { TableHeaderModule } from './modules/tableheader/tableheader.module';
import { GramMahitiModule } from './modules/grammahiti/grammahiti.module';
import { ComplaintModule } from './modules/complaints/complaints.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,

    AdminsModule,
    PanchayatModule,
    DashboardreportsModule,
    AppApisModule,
    DistrictModule,
    TalukaModule,
    SliderModule,
    FilehostModule,
    GalleryModule,
    HeaderModule,
    FooterModule,
    PortfolioModule,
    AchievementModule,
    AbhiprayModule,
    AboutModule,
    ServiceModule,
    SchemeModule,
    NewsModule,
    FormModule,
    ImportantLinkModule,
    UserAbhiprayModule,
    PanchayatRequestModule,
    ContactRequestModule,
    UserComplaintModule,
    PanchayatMemberModule,
    TableSectionModule,
    TableHeaderModule,
    GramMahitiModule,
    ComplaintModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('DB_URL'),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,

      host: 'localhost',
      port: 6379,
      ttl: 2000,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // @IsObject() // Make sure it's an object
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
