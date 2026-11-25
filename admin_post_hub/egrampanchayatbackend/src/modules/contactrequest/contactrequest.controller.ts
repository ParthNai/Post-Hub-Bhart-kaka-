import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ContactRequestService } from './contactrequest.service';
import {
  AllContactRequestQueryDto,
  CreateContactRequestDto,
  ContactRequestQueryDto,
  UpdateContactRequestDto,
} from './dto/contactrequest.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('contactrequest')
@Controller('contactrequest')
export class ContactRequestController {
  constructor(private readonly contactrequestService: ContactRequestService) {}

  @Post()
  create(@Body() createContactRequestDto: CreateContactRequestDto) {
    return this.contactrequestService.create({
      ...createContactRequestDto,
    });
  }

  @Get()
  find(@Query() query: ContactRequestQueryDto) {
    console.log('query', query);
    return this.contactrequestService.find(query);
  }

  @Get('all')
  findAll(@Query() query: AllContactRequestQueryDto) {
    return this.contactrequestService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactrequestService.findOne(id);
  }

  @Patch()
  update(@Body() updateContactRequestDto: UpdateContactRequestDto) {
    return this.contactrequestService.update({
      ...updateContactRequestDto,
    });
  }

  @Delete()
  remove(@Body('_id') id: string) {
    return this.contactrequestService.remove(id);
  }
}
