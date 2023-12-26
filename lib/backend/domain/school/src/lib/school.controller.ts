import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ISchoolService } from './school.interface';
import {
  AddDomainRequest,
  AddDomainResponse,
  SaveSchoolRequest,
  SaveSchoolResponse,
} from './dto/school.controller';

@Controller('/v1/school')
export class SchoolController {
  constructor(
    @Inject(ISchoolService) private readonly schoolService: ISchoolService
  ) {}

  @Get()
  async getSchoolByWildCard(@Query('q') query: string) {
    const result = await this.schoolService.querySchoolByWildCard(query);
    return result;
  }

  @Post()
  async saveSchool(
    @Body() request: SaveSchoolRequest
  ): Promise<SaveSchoolResponse> {
    const result = await this.schoolService.saveSchool(request);
    const response = SaveSchoolResponse.create(result);
    return response;
  }

  @Post('/domain')
  async addDomain(
    @Body() request: AddDomainRequest
  ): Promise<AddDomainResponse> {
    const result = await this.schoolService.addDomain(request);
    const response = AddDomainResponse.create(result);
    return response;
  }
}
