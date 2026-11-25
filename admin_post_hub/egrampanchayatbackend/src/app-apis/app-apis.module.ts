import { Module } from '@nestjs/common';
import { AppApisService } from './app-apis.service';
import { AppApisController } from './app-apis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admins/schema/admins.schema';
import {
  Panchayat,
  PanchayatSchema,
} from 'src/panchayat/schema/panchayat.schema';
import { Footer, FooterSchema } from 'src/modules/footer/schema/footer.schema';
import { Header, HeaderSchema } from 'src/modules/header/schema/header.schema';
import {
  SubHeader,
  SubHeaderSchema,
} from 'src/modules/header/schema/subHeader.schema';
import {
  Abhipray,
  AbhipraySchema,
} from 'src/modules/abhipray/schema/abhipray.schema';
import { About, AboutSchema } from 'src/modules/about/schema/about.schema';
import {
  Achievement,
  AchievementSchema,
} from 'src/modules/achievement/schema/achievement.schema';
import {
  District,
  DistrictSchema,
} from 'src/modules/district/schema/district.schema';
import {
  ContactRequest,
  ContactRequestSchema,
} from 'src/modules/contactrequest/schema/contactrequest.schema';
import {
  ImportantLink,
  ImportantLinkSchema,
} from 'src/modules/importantlink/schema/importantlink.schema';
import { News, NewsSchema } from 'src/modules/news/schema/news.schema';
import {
  PanchayatRequest,
  PanchayatRequestSchema,
} from 'src/modules/panchayatrequest/schema/panchayatrequest.schema';
import {
  Portfolio,
  PortfolioSchema,
} from 'src/modules/portfolio/schema/portfolio.schema';
import { Scheme, SchemeSchema } from 'src/modules/scheme/schema/scheme.schema';
import {
  SchemeCategory,
  SchemeCategorySchema,
} from 'src/modules/scheme/schema/schemecategory.schema';
import {
  Service,
  ServiceSchema,
} from 'src/modules/service/schema/service.schema';
import { Slider, SliderSchema } from 'src/modules/slider/schema/slider.schema';
import { Taluka, TalukaSchema } from 'src/modules/taluka/schema/taluka.schema';
import {
  UserAbhipray,
  UserAbhipraySchema,
} from 'src/modules/userabhipray/schema/userabhipray.schema';
import {
  UserComplaint,
  UserComplaintSchema,
} from 'src/modules/usercomplaint/schema/usercomplaint.schema';
import { Form, FormSchema } from 'src/modules/form/schema/form.schema';
import {
  Gallery,
  GallerySchema,
} from 'src/modules/gallery/schema/gallery.schema';
import { ConfigModule } from 'src/config';
import {
  PanchayatMember,
  PanchayatMemberSchema,
} from 'src/modules/panchayatmember/schema/panchayatmember.schema';
import {
  GramMahiti,
  GramMahitiSchema,
} from 'src/modules/grammahiti/schema/grammahiti.schema';
import {
  TableHeader,
  TableHeaderSchema,
} from 'src/modules/tableheader/schema/tableheader.schema';
import {
  TableSection,
  TableSectionSchema,
} from 'src/modules/tablesection/schema/tablesection.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Panchayat.name, schema: PanchayatSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Footer.name, schema: FooterSchema },
      { name: Header.name, schema: HeaderSchema },
      { name: SubHeader.name, schema: SubHeaderSchema },
      { name: Abhipray.name, schema: AbhipraySchema },
      { name: Form.name, schema: FormSchema },

      { name: About.name, schema: AboutSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: District.name, schema: DistrictSchema },
      { name: ContactRequest.name, schema: ContactRequestSchema },
      { name: ImportantLink.name, schema: ImportantLinkSchema },
      { name: News.name, schema: NewsSchema },
      { name: PanchayatRequest.name, schema: PanchayatRequestSchema },
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Scheme.name, schema: SchemeSchema },
      { name: SchemeCategory.name, schema: SchemeCategorySchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Slider.name, schema: SliderSchema },
      { name: Taluka.name, schema: TalukaSchema },
      { name: UserAbhipray.name, schema: UserAbhipraySchema },
      { name: UserComplaint.name, schema: UserComplaintSchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: PanchayatMember.name, schema: PanchayatMemberSchema },
      { name: GramMahiti.name, schema: GramMahitiSchema },
      { name: TableHeader.name, schema: TableHeaderSchema },
      { name: TableSection.name, schema: TableSectionSchema },
      { name: UserAbhipray.name, schema: UserAbhipraySchema },
    ]),
  ],
  controllers: [AppApisController],
  providers: [AppApisService],
})
export class AppApisModule {}
