import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ISchoolService } from './school.interface';
import {
  AddDomainRequest,
  AddDomainResponse,
  DeleteDomainDomainIdParam,
  GetAllDomainsSchoolIdParam,
  GetAllDomainsResponse,
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

  @Get('/domain/:schoolId')
  async getAllDomains(
    @Param('schoolId') schoolId: GetAllDomainsSchoolIdParam
  ): Promise<GetAllDomainsResponse[]> {
    const result = await this.schoolService.getAllDomains(schoolId.schoolId);
    const response = result.map((domain) =>
      GetAllDomainsResponse.create({ id: domain.id, domain: domain.domain })
    );
    return response;
  }

  @Delete('/domain/:domainId')
  async deleteDomain(@Param('domainId') domainId: DeleteDomainDomainIdParam) {
    await this.schoolService.deleteDomain(domainId.domainId);
  }
}
