import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AddDomainCommand,
  DeleteDomainCommand,
  GetDomainsBySchoolIdQuery,
  GetDomainsBySchoolIdResult,
  QuerySchoolByWildCardResult,
  SaveSchoolCommand,
  SaveSchoolResult,
  UpdateSchoolCommand,
  UpdateSchoolResult,
} from './dto/school.service';
import { ISchoolRepository, ISchoolService } from './school.interface';
import { School } from '@acamia/entities';
import { SchoolDomain } from 'lib/backend/domain/entities/src/lib/schoolDomain.entity';

@Injectable()
export class SchoolService implements ISchoolService {
  constructor(
    @Inject(ISchoolRepository)
    private readonly schoolRepository: ISchoolRepository
  ) {}

  async querySchoolByWildCard(
    query: string
  ): Promise<QuerySchoolByWildCardResult> {
    const result: School[] = await this.schoolRepository.findSchoolByWildCard(
      query
    );

    return result.map((school) => ({ id: school.id, name: school.name }));
  }
  async updateSchool(
    command: UpdateSchoolCommand
  ): Promise<UpdateSchoolResult> {
    const existingSchool = this.schoolRepository.findSchoolById(command.id);

    if (existingSchool === null) {
      throw new NotFoundException(
        `School with id ${command.id} does not exist`
      );
    }
    const newSchool = School.create({
      id: command.id,
      name: command.name,
      city: command.city,
      stateOrProvince: command.stateOrProvince,
      country: command.country,
    });
    const result = await this.schoolRepository.updateSchool(newSchool);

    return {
      id: result.id,
      description: result.description,
      name: result.name,
      city: result.city,
      stateOrProvince: result.stateOrPronvince,
      country: result.country,
      domains: result.domains.map((domain) => ({
        id: domain.id,
        domain: domain.domain,
      })),
    };
  }

  async saveSchool(command: SaveSchoolCommand): Promise<SaveSchoolResult> {
    const newSchool = new School();
    newSchool.name = command.name;
    newSchool.description = command.description;
    newSchool.city = command.city;
    newSchool.stateOrPronvince = command.stateOrProvince;
    newSchool.country = command.country;

    const savedSchool = await this.schoolRepository.saveSchool(newSchool);
    return {
      id: savedSchool.id,
      name: savedSchool.name,
      description: savedSchool.description,
      city: savedSchool.city,
      stateOrProvince: savedSchool.stateOrPronvince,
      country: savedSchool.country,
    };
  }

  async addDomain(command: AddDomainCommand): Promise<void> {
    const existingSchool = await this.schoolRepository.findSchoolById(
      command.schoolId
    );
    if (existingSchool === null) {
      throw new NotFoundException(
        `School with id ${command.schoolId} does not exist`
      );
    }

    const schoolDomain = new SchoolDomain();
    schoolDomain.domain = command.schoolDomain;

    await this.schoolRepository.addDomain(schoolDomain, existingSchool);
  }

  async getAllDomains(
    query: GetDomainsBySchoolIdQuery
  ): Promise<GetDomainsBySchoolIdResult> {
    const existingSchool = await this.schoolRepository.findSchoolById(query);

    if (existingSchool == null) {
      throw new NotFoundException(`School with id ${query} does not exist`);
    }

    return existingSchool.domains.map((domain) => ({
      domain: domain.domain,
      id: domain.id,
    }));
  }

  async deleteDomain(command: DeleteDomainCommand): Promise<void> {
    const existingSchoolDomain =
      this.schoolRepository.findSchoolDomainById(command);

    if (existingSchoolDomain === null) {
      throw new NotFoundException(
        `School Domain with id ${command} does not exist`
      );
    }
    await this.schoolRepository.deleteSchoolDomainById(command);
  }
}
