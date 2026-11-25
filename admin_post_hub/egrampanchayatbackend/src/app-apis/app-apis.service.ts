import { Inject, Injectable } from '@nestjs/common';

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, PipelineStage } from 'mongoose';

import { Admin } from 'src/admins/schema/admins.schema';
import { Panchayat } from 'src/panchayat/schema/panchayat.schema';
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
import { IAppHeaderData } from './interface/app-apis.interface';
import {
  AddSuggestionDto,
  GetGramQuery,
  GetSchemeByCategoryNameQuery,
  GetSchemeByIdQuery,
  GetTalakaQuery,
} from './dto/app-apis.dto';
import { createObjectId } from 'src/utils/string.utils';
import { Form } from 'src/modules/form/schema/form.schema';
import { Gallery } from 'src/modules/gallery/schema/gallery.schema';
import { WEBSITE } from 'src/enums';
import { ConfigService } from '@nestjs/config';
import { PanchayatMember } from 'src/modules/panchayatmember/schema/panchayatmember.schema';
import { GramMahiti } from 'src/modules/grammahiti/schema/grammahiti.schema';
import { TableSection } from 'src/modules/tablesection/schema/tablesection.schema';
import { TableHeader } from 'src/modules/tableheader/schema/tableheader.schema';
import { CreatePanchayatRequestDto } from 'src/modules/panchayatrequest/dto/panchayatrequest.dto';
import { CreateContactRequestDto } from 'src/modules/contactrequest/dto/contactrequest.dto';
import { CreateUserComplaintDto } from 'src/modules/usercomplaint/dto/usercomplaint.dto';

const saltOrRounds = 10;

@Injectable()
export class AppApisService {
  constructor(
    @InjectModel(Panchayat.name) private panchayat: Model<Panchayat>,
    @InjectModel(Admin.name) private admin: Model<Admin>,

    @InjectConnection() private connection: Connection,

    @Inject() private readonly config: ConfigService,

    @InjectModel(Footer.name) private footer: Model<Footer>,
    @InjectModel(Header.name) private Header: Model<Header>,
    @InjectModel(SubHeader.name) private SubHeader: Model<SubHeader>,
    @InjectModel(Abhipray.name) private Abhipray: Model<Abhipray>,
    @InjectModel(About.name) private About: Model<About>,
    @InjectModel(Achievement.name) private Achievement: Model<Achievement>,
    @InjectModel(District.name) private District: Model<District>,
    @InjectModel(ContactRequest.name)
    private ContactRequest: Model<ContactRequest>,
    @InjectModel(ImportantLink.name)
    private ImportantLink: Model<ImportantLink>,
    @InjectModel(News.name) private News: Model<News>,
    @InjectModel(Form.name) private Form: Model<Form>,

    @InjectModel(PanchayatRequest.name)
    private PanchayatRequest: Model<PanchayatRequest>,
    @InjectModel(Portfolio.name) private Portfolio: Model<Portfolio>,
    @InjectModel(Scheme.name) private Scheme: Model<Scheme>,
    @InjectModel(SchemeCategory.name)
    private SchemeCategory: Model<SchemeCategory>,
    @InjectModel(Service.name) private Service: Model<Service>,
    @InjectModel(Slider.name) private Slider: Model<Slider>,
    @InjectModel(Taluka.name) private Taluka: Model<Taluka>,
    @InjectModel(UserAbhipray.name) private UserAbhipray: Model<UserAbhipray>,
    @InjectModel(UserComplaint.name)
    private UserComplaint: Model<UserComplaint>,

    @InjectModel(Gallery.name)
    private Gallery: Model<Gallery>,

    @InjectModel(PanchayatMember.name)
    private PanchayatMember: Model<PanchayatMember>,

    @InjectModel(GramMahiti.name)
    private GramMahiti: Model<GramMahiti>,

    @InjectModel(TableSection.name)
    private TableSection: Model<TableSection>,

    @InjectModel(TableHeader.name)
    private TableHeader: Model<TableHeader>,
  ) {}
  async getAboutVisitors() {
    const about = await this.About.findOne({
      panchayatId: { $exists: false },
    });

    return {
      visitor: about.visitors,
    };
  }

  async increaseVisior() {
    const about = await this.About.findOne({
      panchayatId: { $exists: false },
    });

    // return {
    //   visitor: about.visitors,
    // };

    await this.About.findByIdAndUpdate(about._id, {
      $inc: { visitors: 1 },
    });
  }

  async getSchemes(language: string) {
    const schemecatedata = await this.SchemeCategory.aggregate([
      ...statusMatchQuery,
      {
        $lookup: {
          from: 'schemes',
          let: { categoryId: '_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$categoryId', '$$categoryId'] },
              },
            },
          ],
          as: 'data',
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
    ]);

    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'GramSchemes',
          title: 'યોજનાઓ',
          data: schemecatedata || [],
        },
      ],
    };

    return data;
  }

  async getForms(language: string) {
    const formdata = await this.Form.aggregate([
      ...statusMatchQuery,

      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);

    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'FormsPage',
          title: 'ફોર્મ',
          data: formdata || [],
        },
      ],
    };

    return data;
  }
  async getSchemeById(params: GetSchemeByIdQuery) {
    const schemecatedata = await this.Scheme.aggregate([
      ...statusMatchQuery,

      { $match: { _id: createObjectId(params.schemeId) } },
      {
        $project: {
          title: 1,
          external: 1,

          data: '$description',
          link: {
            $cond: {
              if: { $ne: ['$link', ''] },
              then: '$link',
              else: '$$REMOVE',
            },
          },
          linkTitle: {
            $cond: {
              if: { $ne: ['$link', ''] },
              then: 'વધુ વાંચો',
              else: '$$REMOVE',
            },
          },
        },
      },
    ]);
    return schemecatedata[0];
  }

  async getFormById(formId: string) {
    const schemecatedata = await this.Form.aggregate([
      ...statusMatchQuery,

      { $match: { _id: createObjectId(formId) } },
      {
        $project: {
          title: 1,
          external: 1,

          data: '$description',
          link: {
            $cond: {
              if: { $ne: ['$link', ''] },
              then: '$link',
              else: '$$REMOVE',
            },
          },
          linkTitle: {
            $cond: {
              if: { $ne: ['$link', ''] },
              then: 'વધુ વાંચો',
              else: '$$REMOVE',
            },
          },
        },
      },
    ]);
    return schemecatedata[0];
  }

  async getgallery(panchayatId?: string) {
    const gallerydata = await this.Gallery.aggregate([
      // { $match: { _id: createObjectId(formId) } },
      ...panchayatQuery(panchayatId),

      {
        $addFields: {
          imageSrc: '$image',
          id: '$_id',
        },
      },

      { $unwind: '$images' },
      {
        $addFields: {
          imageSrc: '$images',
        },
      },
    ]);
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'GalleryPage',
          title: 'ગેલેરી',
          data: gallerydata || [],
        },
      ],
    };
    return data;
  }

  async getAchievementById(achievementId: string) {
    const achieve = await this.Achievement.findById(achievementId);

    console.log('title', achieve);
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'AboutUsPage',
          image: achieve?.image || '',
          title: achieve?.title || '',
          data: achieve?.description || '',
        },
      ],
    };
    return data;
  }

  async getSchemeByCategoryName(params: GetSchemeByCategoryNameQuery) {
    const category = await this.SchemeCategory.findOne({
      title: params.categoryName,
    });
    const schemecatedata = await this.Scheme.aggregate([
      ...statusMatchQuery,
      {
        $match: {
          categoryId: category._id,
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      // {
      //   $project: {
      //     data: '$description',
      //     external: 1,
      //     link: {
      //       $cond: {
      //         if: { $ne: ['$link', ''] },
      //         then: '$link',
      //         else: '$$REMOVE',
      //       },
      //     },
      //     linkTitle: {
      //       $cond: {
      //         if: { $ne: ['$link', ''] },
      //         then: 'વધુ વાંચો',
      //         else: '$$REMOVE',
      //       },
      //     },
      //   },
      // },
    ]);

    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'GramSchemes',
          title: category.title,
          data: schemecatedata, // Replace schemedata with your actual data array
        },
      ],
    };

    return data;
  }
  async getAbout(panchauatId: string) {
    const about = await this.About.findOne({
      panchayatId:
        panchauatId && panchauatId !== 'main'
          ? panchauatId
          : { $exists: false },
    });

    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'AboutUsPage',
          image: about?.image || '',
          title: about?.title || '',
          data: about.description, // Make sure `desc` is defined in your JS context
        },
      ],
    };

    return data;
  }
  async getTaluka(query: GetTalakaQuery) {
    const district = await this.District.findOne({ name: query.districtName });
    console.log('district', district);
    return await this.Taluka.aggregate([
      {
        $match: {
          districtId: district._id,
        },
      },

      {
        $project: {
          label: '$name',
          value: '$name',
        },
      },
      {
        $sort: {
          label: 1,
        },
      },
    ]);
  }
  async getGram(query: GetGramQuery) {
    const taluka = await this.Taluka.findOne({ name: query.talukaName });
    console.log('taluka', taluka);
    return await this.panchayat.aggregate([
      ...statusMatchQuery,
      {
        $match: {
          talukaId: taluka._id,
        },
      },

      {
        $project: {
          label: '$nameInGj',
          value: {
            $concat: [
              'https://',
              '$subDomain',
              `.${this.config.get('SITENAME')}`,
            ],
          },
        },
      },
      {
        $sort: {
          label: 1,
        },
      },
    ]);
  }
  async getNavData(language: string) {
    // const headerdata = [];
    // const footerdata = [];

    const about_visit = await this.getAboutVisitors();

    // const footerdata = await this.footer.aggregate([...statusMatchQuery]);
    // const headerdata = await this.Header.aggregate([
    //   ...statusMatchQuery,
    //   {
    //     $lookup: {
    //       from: 'subheaders',
    //       let: { headerId: '$_id' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: ['$headerId', '$$headerId'],
    //             },
    //           },
    //         },
    //       ],
    //       as: 'children',
    //     },
    //   },
    // ]);
    const footerdata: IAppHeaderData[] = [
      {
        title: 'Terms And Conditions',
        link: 'termsandconditions',
      },
      {
        title: 'Copyrights',
        link: 'copyrights',
      },
      {
        title: 'Contact Us',
        link: 'contactus',
        isModal: true,
      },
      {
        title: `Visitors : ${about_visit.visitor}`,
        link: '',
      },
    ];
    const schemecategories = await this.SchemeCategory.aggregate([
      ...statusMatchQuery,

      {
        $addFields: {
          link: { $concat: ['gramschemes/', '$title'] },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);

    const headerdata: IAppHeaderData[] = [
      {
        title: 'હોમ પેજ',
        link: '',
      },
      {
        title: 'અમારા વિશે',
        link: 'aboutus',
      },
      {
        title: 'યોજનાઓ',
        link: 'gramschemes',
        children: schemecategories,
      },
      {
        title: 'ફોર્મ',
        link: 'forms',
      },
      {
        title: 'ગેલેરી ',
        link: 'gallery',
      },
      {
        title: 'અભિપ્રાય',
        link: 'suggetions',
        isModal: true,
      },
      {
        title: 'સંપર્ક',
        link: 'contactus',
        isModal: true,
      },
    ];
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'NavBar',
          logoUrl: `/images/logo/logo.png`,
          title: 'ઈ-ગ્રામ પંચાયત',
          headline: 'ગ્રામ પંચાયતને પોતાની વેબસાઈટ દ્વારા ઓળખ આપવાનો પ્રયાસ...',
          otherLogos: [
            { src: '/images/otherlogos/selfmade.png' },
            { src: '/images/otherlogos/digitalIndia.png' },
            { src: '/images/otherlogos/skillIndia.png' },
            { src: '/images/otherlogos/swatchBharat.png' },
            { src: '/images/otherlogos/betiBachao.png' },
          ],
          searchInputLabel: 'Search Your Grampanchayat',
        },
        {
          layout: 'NavLinks',
          addBtnTitle: 'ગ્રામ પંચાયતની વેબસાઈટ બનાવવા જોડવો',
          addBtnLink: 'addpanchayat',
          data: headerdata || [], // Replace `headerdata` with actual JS data or a variable
        },
        {
          layout: 'Footer',
          imageSrc: '/images/background/FooterBg.png',
          data: footerdata || [], // Replace `footerdata` with actual JS data or a variable
          visitors: about_visit?.visitor || 0, // Replace `about_visit` with your JS object
          copyright: `@${new Date().getFullYear()} copyright egrampanchayat.in`,
          social: [
            {
              icon: '/images/social/insta.svg',
              link: 'https://www.instagram.com/e_grampanchayat?utm_source=qr&igsh=MWVpMmZzMnRhZTVjYg==',
              external: true,
              isModal: false,
            },
            {
              icon: '/images/social/facebook.svg',
              link: 'https://www.facebook.com/egrampanchayat.in',
              external: true,
              isModal: false,
            },
            {
              icon: '/images/social/x.svg',
              link: 'https://x.com/panchaytpost',
              external: true,
              isModal: false,
            },
          ],
        },
      ],
    };

    return data;
  }

  async gramNavbar(panchayatId: string) {
    const panchayatdistrictIdQuery = await this.panchayat.aggregate([
      {
        $match: {
          _id: createObjectId(panchayatId),
        },
      },
      {
        $lookup: {
          from: 'districts',
          localField: 'districtId',
          foreignField: '_id',
          as: 'district',
        },
      },
      {
        $unwind: '$district',
      },

      {
        $addFields: {
          districtName: '$district.name',
        },
      },

      {
        $lookup: {
          from: 'talukas',
          localField: 'talukaId',
          foreignField: '_id',
          as: 'taluka',
        },
      },
      {
        $unwind: '$taluka',
      },

      {
        $addFields: {
          talukaName: '$taluka.name',
        },
      },
    ]);
    const panchayat = panchayatdistrictIdQuery[0];
    const website = this.config.get(`SITENAME`);
    const about_visit = await this.getAboutVisitors();

    const schemecategories = await this.SchemeCategory.aggregate([
      ...statusMatchQuery,

      {
        $addFields: {
          link: { $concat: ['gramschemes/', '$title'] },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);

    // const formdata = await this.Form.aggregate([
    //   ...statusMatchQuery,

    //   {
    //     $addFields: {
    //       id: '$_id',
    //     },
    //   },
    //   {
    //     $sort: {
    //       position: 1,
    //     },
    //   },
    // ]);

    const footerdata: IAppHeaderData[] = [
      {
        title: 'Terms And Conditions',
        link: 'termsandconditions',
      },
      {
        title: 'Copyrights',
        link: 'copyrights',
      },
      {
        title: 'Contact Us',
        link: 'contactus',
        isModal: true,
      },
      {
        title: `Visitors : ${about_visit.visitor}`,
        link: '',
      },
    ];
    const mahitiData = await this.GramMahiti.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),
      {
        $group: {
          _id: '$sectionId',
        },
      },
      {
        $lookup: {
          from: 'tablesections',
          let: { sectionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$sectionId'] },
              },
            },
            {
              $project: {
                title: '$title',
                link: { $concat: ['/info', '/', { $toString: '$_id' }] },
                image: '$image',
              },
            },
          ],
          as: 'section',
        },
      },
      {
        $unwind: {
          path: '$section',
        },
      },
      {
        $group: {
          _id: '$section._id',
          title: { $first: '$section.title' },
          image: { $first: '$section.image' },
          link: { $first: '$section.link' },
        },
      },
    ]);
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'NavBar',
          logoUrl: panchayat?.logoPath || '/images/logo/logo.png',
          gramName: `${panchayat?.nameInGj || ''} ગ્રામ પંચાયત`,
          districtTitle: 'જિલ્લો',
          subDistrictTitle: 'તાલુકા ',
          subDistrict: panchayat?.talukaName || '',
          district: panchayat?.districtName || '',
          otherLogos: [
            { src: '/images/otherlogos/selfmade.png' },
            { src: '/images/otherlogos/digitalIndia.png' },
            { src: '/images/otherlogos/skillIndia.png' },
            { src: '/images/otherlogos/swatchBharat.png' },
            { src: '/images/otherlogos/betiBachao.png' },
          ],
        },
        {
          layout: 'NavLinks',
          addBtnTitle: 'E-Home',
          logoUrl: panchayat?.logoPath || '/images/logo/logo.png',
          data: [
            {
              title: 'હોમ',
              external: false,
              link: '/',
            },
            {
              title: 'પંચાયતના સભ્યો',
              external: false,
              link: '/panchayatmember',
            },
            {
              title: 'માહિતી',
              external: false,
              // link: '',
              children: mahitiData || [],
              // children: [],
            },
            {
              title: 'યોજનાઓ',
              link: 'gramschemes',
              external: false,
              children: schemecategories || [],
            },
            {
              title: 'ફોર્મ',
              link: 'forms',
              external: false,
              // children: formdata || [],
            },
            {
              title: 'ફોટો ગેલેરી',
              external: false,
              link: '/gallery',
            },
            {
              title: 'અભિપ્રાય',
              link: 'suggestionsgram',
              external: false,
              isModal: true,
              postlink: `suggestions/${panchayat?.name || ''}`,
              children: [],
            },
            {
              title: 'ફરિયાદ',
              link: 'complaint',
              external: false,
              isModal: true,
              postlink: `complaint/${panchayat?.name || ''}`,
              children: [],
            },
            {
              title: 'સંપર્ક',
              link: 'contactusgram',
              datalink: `contactus/${panchayat?.name || ''}`,
              external: false,
              isModal: true,
              children: [],
            },
          ],
        },
        {
          layout: 'Footer',
          imageSrc: '/images/background/FooterBg.png',
          data: footerdata || [],
          visitors: about_visit?.visitor || 0,
          copyright: `@${new Date().getFullYear()} copyright egrampanchayat.in`,
          social: [
            {
              icon: '/images/social/insta.svg',
              link: 'https://www.instagram.com/e_grampanchayat?utm_source=qr&igsh=MWVpMmZzMnRhZTVjYg==',
              external: true,
              isModal: false,
            },
            {
              icon: '/images/social/facebook.svg',
              link: 'https://www.facebook.com/egrampanchayat.in',
              external: true,
              isModal: false,
            },
            {
              icon: '/images/social/x.svg',
              link: 'https://x.com/panchaytpost',
              external: true,
              isModal: false,
            },
            {
              icon: `/images/otherlogos/login.svg`,
              link: `https://admin.${website}`,
              external: true,
              isModal: false,
            },
          ],
        },
      ],
    };

    return data;
  }

  async getHomeData(language: string) {
    const sliderdata = await this.Slider.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(),
    ]);
    const disdata = await this.District.aggregate([
      ...statusMatchQuery,
      {
        $project: {
          label: '$name',
          value: '$name',
        },
      },
      {
        $sort: {
          label: 1,
        },
      },
    ]);
    const portfdata = await this.Portfolio.aggregate([...statusMatchQuery]);
    const about = {
      title: 'અમારા વિશે',
      desc: 'about',
      link: 'aboutus',
    };
    const schemedata = await this.SchemeCategory.aggregate([
      ...statusMatchQuery,
      {
        $addFields: {
          link: { $concat: ['gramschemes', '/', '$title'] },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);
    const newsdata = await this.News.aggregate([...statusMatchQuery]);
    const district = disdata;
    const sub_district = await this.Taluka.aggregate([
      ...statusMatchQuery,
      {
        $project: {
          label: '$name',
          value: '$name',
        },
      },
    ]);
    const grampanchayat = await this.panchayat.countDocuments();
    const abhidata = await this.Abhipray.aggregate([...statusMatchQuery]);
    const achievedata = await this.Achievement.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(),
    ]);
    const linkdata = await this.ImportantLink.aggregate([...statusMatchQuery]);
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'Sliders',
          advertise: {
            imageSrc: `/images/logo/logo-light.png`,
            link: 'www.google.com',
          },
          data: sliderdata || [],
        },
        {
          layout: 'SearchContainer',
          data: [
            {
              name: 'district',
              label: 'જિલ્લા',
              placeholder: 'જિલ્લા ',
              type: 'searchcompletemultiple',
              size: 'medium',
              dependentChild: 'taluka',
              dependentOtherChild: 'gram',
              options: disdata || [],
            },
            {
              name: 'taluka',
              label: 'તાલુકા',
              placeholder: 'તાલુકા ',
              type: 'searchcompletemultiple',
              size: 'medium',
              dependentChild: 'gram',
            },
            {
              name: 'gram',
              label: 'ગ્રામપંચાયત',
              placeholder: 'ગ્રામપંચાયત ',
              type: 'searchcompletemultiple',
              size: 'medium',
            },
          ],
        },
        {
          layout: 'PortFolio',
          data: portfdata || [],
        },
        {
          layout: 'SubLayouts',
          data: [
            {
              name: 'About us',
              width: 4,
              type: 'aboutus',
              title: about?.title || '',
              description: about?.desc || '',
              linkTitle: 'વધુ વાંચો ',
              link: about?.link || '',
            },
            {
              name: 'shcemes',
              width: 4,
              type: 'schemelist',
              title: 'યોજનાઓ',
              data: schemedata || [],
              linkTitle: 'વધુ વાંચો ',
              link: 'gramschemes',
            },
            {
              name: 'news',
              width: 4,
              type: 'news',
              title: 'અવનવા સમાચાર',
              data: newsdata || [],
              // Uncomment below if needed
              // linkTitle: "વધુ વાંચો ",
              // link: "www.google.com"
            },
          ],
        },
        {
          layout: 'Counter',
          data: [
            {
              title: 'જિલ્લા',
              count:
                Array.isArray(district) && district.length > 0
                  ? district.length
                  : 0,
            },
            {
              title: 'તાલુકા',
              count:
                Array.isArray(sub_district) && sub_district.length > 0
                  ? sub_district.length
                  : 0,
            },
            {
              title: 'ગામડા',
              count: 18584,
            },
            {
              title: 'ગ્રામ પંચાયતો',
              count: 14292,
            },
            {
              title: 'ઈ-ગ્રામ પંચાયતો',
              count: grampanchayat,
            },
          ],
        },
        {
          layout: 'Abhipray',
          title: 'મંતવ્ય ',
          icon: '/images/abhipray/sarpanch.png',
          data: abhidata || [],
        },
        {
          layout: 'Achievements',
          title: 'ગ્રામ પંચાયતોની સિદ્ધિઓ',
          data: achievedata || [],
        },
        {
          title: 'મહત્વપૂર્ણ લિંક્સ',
          layout: 'LogoLinks',
          data: linkdata || [],
        },
      ],
    };

    return data;
  }

  async getGramHomeData(panchayatId: string) {
    const sliderdata = await this.Slider.aggregate([
      ...statusMatchQuery,

      ...panchayatQuery(panchayatId),
    ]);
    const panchayat = await this.panchayat.findOne({
      _id: panchayatId,
      isActive: true,
    });
    const about = await this.About.findOne({ panchayatId: panchayatId });

    const grammember = await this.PanchayatMember.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),

      {
        $match: {
          occupation: {
            $in: [
              'સરપંચ શ્રી',
              'ઉપસરપંચ શ્રી',
              'તલાટી કમ મંત્રી શ્રી',
              'કમ્પ્યુટર ઓપરેટર શ્રી (V.C.E)',
            ],
          },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);
    const member = await this.PanchayatMember.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),

      {
        $match: {
          occupation: {
            $in: [
              'સંસદસભ્ય શ્રી',
              'ધારાસભ્ય શ્રી',
              'જિલ્લા પંચાયત સદસ્ય શ્રી',
              'તાલુકા પંચાયત સદસ્ય શ્રી',
              'સામાજિક કાર્યકર્તા',
              'વેબસાઈટ સ્પોન્સર',
            ],
          },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);

    const achievements = await this.Achievement.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),
      {
        $addFields: {
          id: '$_id',
        },
      },
    ]);
    const linkdata = await this.ImportantLink.aggregate([...statusMatchQuery]);
    const sectiondata = await this.TableSection.aggregate([
      ...statusMatchQuery,

      {
        $sort: {
          position: 1,
        },
      },
      {
        $addFields: {
          link: { $concat: ['/info', '/', { $toString: '$_id' }] },
        },
      },
      {
        $project: {
          title: '$title',
          image: '$image',
          link: '$link',
        },
      },
    ]);
    // const sectiondata = await this.GramMahiti.aggregate([
    //   ...statusMatchQuery,
    //   ...panchayatQuery(panchayatId),
    //   {
    //     $group: {
    //       _id: '$sectionId',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'tablesections',
    //       let: { sectionId: '$_id' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: { $eq: ['$_id', '$$sectionId'] },
    //           },
    //         },
    //         {
    //           $project: {
    //             title: '$title',
    // link: { $concat: ['/info', '/', { $toString: '$_id' }] },
    //             image: '$image',
    //           },
    //         },
    //       ],
    //       as: 'section',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$section',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$section._id',
    //       title: { $first: '$section.title' },
    //       image: { $first: '$section.image' },
    //       link: { $first: '$section.link' },
    //     },
    //   },
    // ]);
    const data = {
      title: 'Egram Panchayat',
      gramid: panchayatId,
      data: [
        {
          layout: 'Sliders',
          data: sliderdata || [],
        },
        // {
        //   layout: "Advertise",
        //   imageSrc: "/images/logo/toyalogo.jpg",
        //   mobileImageSrc: "/images/logo/toyamobile.png",
        //   link: "https://play.google.com/store/apps/details?id=com.toyauser",
        //   title: "સૌજન્ય"
        // },
        {
          layout: 'GramMainInfo',
          gramInfo: {
            title: `${panchayat?.nameInGj || ''} ગ્રામ પંચાયત`,
            description: about?.description || '',
            linkTitle: 'વધુ વાંચો ',
            link: 'aboutus',
          },
          gramPeople: {
            title: 'ગ્રામ પંચાયતના પદાધિકારીઓ',
            data: grammember || [],
          },
          governmentPeople: {
            title: 'પ્રતિનિધિઓ ',
            data: member || [],
          },
        },
        {
          layout: 'GramIcons',
          title: 'ગ્રામ વિશેની માહિતી',
          data: sectiondata || [],

          // data: [],
        },
        {
          layout: 'Achievements',
          title: 'ગ્રામ પંચાયતની સિદ્ધિઓ',
          data: achievements || [],
        },
        {
          title: 'મહત્વપૂર્ણ લિંક્સ',
          layout: 'LogoLinks',
          data: linkdata || [],
        },
      ],
    };

    return data;
  }

  async getGramByName(name: string) {
    const panchayat = await this.panchayat.findOne({
      subDomain: name,
      isActive: true,
    });
    return panchayat._id;
  }

  async gramContact(panchayatId: string) {
    const panchayatdistrictIdQuery = await this.panchayat.aggregate([
      {
        $match: {
          _id: createObjectId(panchayatId),
        },
      },
      {
        $lookup: {
          from: 'districts',
          localField: 'districtId',
          foreignField: '_id',
          as: 'district',
        },
      },
      {
        $unwind: '$district',
      },

      {
        $addFields: {
          districtName: '$district.name',
        },
      },

      {
        $lookup: {
          from: 'talukas',
          localField: 'talukaId',
          foreignField: '_id',
          as: 'taluka',
        },
      },
      {
        $unwind: '$taluka',
      },

      {
        $addFields: {
          talukaName: '$taluka.name',
        },
      },
    ]);
    const panchayat = panchayatdistrictIdQuery[0];
    const grammember = await this.PanchayatMember.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),

      {
        $match: {
          occupation: {
            $in: [
              'સરપંચ શ્રી',
              'ઉપસરપંચ શ્રી',
              'તલાટી કમ મંત્રી શ્રી',
              'કમ્પ્યુટર ઓપરેટર શ્રી (V.C.E)',
            ],
          },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);
    const data = {
      gramText: 'ગ્રામ પંચાયત નું નામ ',
      addressText: 'સરનામું ',
      gram: panchayat?.name || '',
      address: `At. ${panchayat.name}, Taluka - ${panchayat.talukaName}, District - ${panchayat.districtName}`,
      data: [
        {
          layout: 'Tabular',
          srnotitle: 'અ.નં.',
          header: [
            {
              key: 'name',
              title: 'નામ',
              width: 2,
            },
            {
              key: 'occupation',
              title: 'હોદ્દો',
              width: 1,
            },
            {
              key: 'mobile',
              title: 'મોબાઈલ નંબર',
              width: 1,
            },
          ],
          rows: grammember || [],
        },
      ],
    };

    return data;
  }

  async getGramInfo(sectionId: string, panchayatId: string) {
    const section = await this.TableSection.findById(sectionId);

    const positionField = await this.TableHeader.findOne({
      name: 'ક્રમાંક',
      sectionId: sectionId,
    });
    console.log('positionField', positionField);
    // var sort = {};
    // sort[positionField.id] = 1;
    const positionFieldId = positionField._id.toString();
    const headers = await this.TableHeader.aggregate([
      {
        $match: {
          sectionId: createObjectId(sectionId),
        },
      },
      {
        $addFields: {
          width: 2,
        },
      },
      {
        $project: {
          key: '$_id',
          title: '$name',
          type: '$type',
          width: 1,
          isHidden: 1,
        },
      },
    ]);
    const gramInfo = await this.GramMahiti.aggregate([
      {
        $match: {
          sectionId: createObjectId(sectionId),
          panchayatId: createObjectId(panchayatId),
        },
      },
      // {
      //   $group: {
      //     _id: {
      //       sectionId: '$sectionId',
      //       panchayatId: '$panchayatId',
      //     },
      //     data: { $push: '$$ROOT' },
      //   },
      // },

      // {
      //   $lookup: {
      //     from: 'grammahiti',
      //     localField: '_id',
      //     foreignField: 'headerId',
      //     as: 'headerData',
      //   },
      // },
      {
        $group: {
          _id: {
            recordAddId: '$recordAddId',
          },
          sectionId: { $first: '$sectionId' },
          headers: { $push: '$$ROOT' },
        },
      },
    ]);

    const infoMap = gramInfo
      .map((e: any) => {
        return e.headers.reduce((prev, d) => {
          prev[d.headerId] = d.value;
          return prev;
        }, {});
      })
      .sort((a, b) => {
        // return a[positionField._id] - b[positionField.id];
        return a[positionFieldId] - b[positionFieldId];
      });
    console.log('infoMap', infoMap);
    const data = {
      title: section.title,
      noInfoTitle: 'માહિતી ઉપલબ્ધ નથી',
      data:
        gramInfo && gramInfo.length > 0
          ? [
              {
                layout: 'Tabular',
                header:
                  headers && headers.length > 0
                    ? headers.filter((e) => !e.isHidden)
                    : [],
                rows: infoMap,
                srnotitle: 'અ.નં.',
              },
            ]
          : null,
    };

    return data;
  }

  async gramMember(panchayatId: string) {
    const grammember = await this.PanchayatMember.aggregate([
      ...statusMatchQuery,
      ...panchayatQuery(panchayatId),

      {
        $match: {
          occupation: {
            $in: ['સરપંચ શ્રી', 'ઉપસરપંચ શ્રી', 'સભ્ય શ્રી'],
          },
        },
      },
      {
        $sort: {
          position: 1,
        },
      },
    ]);
    const data = {
      title: 'Egram Panchayat',
      data: [
        {
          layout: 'PanchayatPeople',
          title: 'ગ્રામ પંચાયતના સભ્યો',
          data: grammember && grammember.length > 0 ? grammember : [],
        },
      ],
    };

    return data;
  }

  async searchGram(gramName: string) {
    const panchayatdistrictIdQuery = await this.panchayat.aggregate([
      ...statusMatchQuery,
      {
        $match: {
          $or: [
            {
              name: { $regex: gramName, $options: 'i' },
            },
            {
              nameInGj: { $regex: gramName, $options: 'i' },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'districts',
          localField: 'districtId',
          foreignField: '_id',
          as: 'district',
        },
      },
      {
        $unwind: '$district',
      },

      {
        $addFields: {
          districtName: '$district.name',
        },
      },

      {
        $lookup: {
          from: 'talukas',
          localField: 'talukaId',
          foreignField: '_id',
          as: 'taluka',
        },
      },
      {
        $unwind: '$taluka',
      },

      {
        $addFields: {
          talukaName: '$taluka.name',
        },
      },
      {
        $addFields: {
          link: {
            $concat: [
              'https://',
              '$subDomain',
              '.',
              this.config.get('SITENAME'),
            ],
          },
        },
      },
      {
        $project: {
          id: '$_id',
          gramName: '$name',
          district: '$districtName',
          taluko: '$talukaName',
          nameInGj: '$nameInGj',
          link: 1,
        },
      },
    ]);
    return panchayatdistrictIdQuery;
    // return await this.panchayat.aggregate([...statusMatchQuery,

    //   'id' => $gram_item->id,
    //   'gramName' => $gram_item->gram_name,
    //   'district' => $gram_item->district_name,
    //   'taluko' => $gram_item->sub_district_name,
    //   'link' => 'https://' . $gram_item->user_name . '.' . 'egrampanchayat.in',
    // ])
  }

  async addSuggestion(data: AddSuggestionDto) {
    console.log('data', data);
    return await this.UserAbhipray.create(data);
  }

  async panchayatRequest(data: CreatePanchayatRequestDto) {
    console.log('data', data);
    return await this.PanchayatRequest.create(data);
  }

  async addContactRequest(data: CreateContactRequestDto) {
    console.log('data', data);
    return await this.ContactRequest.create(data);
  }

  async addComplaint(data: CreateUserComplaintDto) {
    console.log('data', data);
    return await this.UserComplaint.create(data);
  }
}

export const statusMatchQuery: PipelineStage[] = [
  {
    $match: {
      isActive: true,
    },
  },
];

export const panchayatQuery = (panchayatId?: string) => {
  const pipeLine: PipelineStage[] = [];
  console.log('gallery', panchayatId);
  if (panchayatId && panchayatId.toUpperCase() !== WEBSITE.MAIN) {
    pipeLine.push({
      $match: {
        panchayatId: createObjectId(panchayatId),
      },
    });
  } else {
    pipeLine.push({
      $match: {
        panchayatId: { $exists: false },
      },
    });
  }
  return pipeLine;
};
