import { Injectable, Inject } from '@nestjs/common';
import { IUnitOfWorkService } from '@acamia/backend-common';
import { EntityManager, ILike, Repository } from 'typeorm';
import { ISchoolRepository } from './school.interface';
import { School, SchoolDomain } from '@acamia/entities';
import {
  Environment,
  IAppConfigService,
} from 'lib/backend/common/src/lib/config/config.module';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchoolRepository implements ISchoolRepository {
  constructor(
    @Inject(IUnitOfWorkService)
    private readonly uowService: IUnitOfWorkService<EntityManager>,
    @Inject(IAppConfigService)
    private readonly configService: IAppConfigService
  ) {
    this.schoolRepo = uowService.getManager().getRepository(School);
    this.schoolDomainRepo = uowService.getManager().getRepository(SchoolDomain);
  }

  private schoolRepo: Repository<School>;
  private schoolDomainRepo: Repository<SchoolDomain>;

  async findSchoolByWildCard(query: string): Promise<School[]> {
    const wildcard = ILike('%' + query + '%');
    return await this.schoolRepo.find({
      where: [
        { name: wildcard },
        { description: wildcard },
        { city: wildcard },
        { country: wildcard },
        { stateOrPronvince: wildcard },
      ],
    });
  }

  async saveSchool(school: School): Promise<School> {
    if (this.configService.getNodeEnv() === Environment.Test) {
      school.id = uuidv4();
    }
    return await this.schoolRepo.save(school);
  }
  async saveSchools(schools: School[]): Promise<School[]> {
    if (this.configService.getNodeEnv() === Environment.Test) {
      for (const school of schools) {
        school.id = uuidv4();
      }
    }
    return await this.schoolRepo.save(schools);
  }

  async findSchoolById(schoolId: string): Promise<School | null> {
    return await this.schoolRepo.findOne({ where: { id: schoolId } });
  }

  async addDomain(
    schoolDomain: SchoolDomain,
    school: School
  ): Promise<SchoolDomain> {
    if (this.configService.getNodeEnv() === Environment.Test) {
      schoolDomain.id = uuidv4();
    }
    school.addDomain(schoolDomain);
    return await this.schoolDomainRepo.save(schoolDomain,);
  }

  async findSchoolDomainById(
    schoolDomainId: string
  ): Promise<SchoolDomain | null> {
    return await this.schoolDomainRepo.findOne({
      where: { id: schoolDomainId },
    });
  }

  async updateSchool(school: School): Promise<School> {
    return await this.schoolRepo.save(school);
  }

  async deleteSchoolDomainById(schoolDomainId: string): Promise<void> {
    await this.schoolDomainRepo.delete({ id: schoolDomainId });
  }
}
