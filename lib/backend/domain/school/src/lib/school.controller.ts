import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ISchoolService } from './school.interface';

@Controller('/v1/school')
export class SchoolController {
  constructor(
    @Inject(ISchoolService) private readonly schoolService: ISchoolService
  ) {}

  @Get()
  getSchoolByWildCard(@Query('q') query: string) {
    const result = this.schoolService.querySchoolByWildCard(query);
    return result;
  }
}
