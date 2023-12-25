import { PersistenceModule } from '@acamia/backend-common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from 'lib/backend/common/src/lib/config/config.module';
import { EntityManager } from 'typeorm';
import {
  ISchoolRepository,
  ISchoolRepositoryProvider,
  ISchoolService,
  ISchoolServiceProvider,
} from './school.interface';
import { SchoolRepository } from './school.repository';
import { SchoolService } from './school.service';
import { School, SchoolDomain } from '@acamia/entities';
import {
  SaveSchoolCommand,
  SaveSchoolResult,
  UpdateSchoolCommand,
} from './dto/school.service';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

describe('SCHOOL SERVICE TEST', () => {
  let manager: EntityManager;
  let app: TestingModule;
  let schoolRepository: ISchoolRepository;
  let schoolService: ISchoolService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PersistenceModule, AppConfigModule],
      providers: [
        ISchoolRepositoryProvider({ useClass: SchoolRepository }),
        ISchoolServiceProvider({ useClass: SchoolService }),
      ],
    }).compile();
    manager = app.get<EntityManager>(EntityManager);
    schoolRepository = app.get<ISchoolRepository>(ISchoolRepository);
    schoolService = app.get<ISchoolService>(ISchoolService);
  });

  afterEach(async () => {
    await manager.getRepository(School).clear();
  });

  describe('saveSchool', () => {
    test('SHOULD saves school WHEN given a valid school', async () => {
      const newSchool: SaveSchoolCommand = {
        name: 'Covenant University',
        description: 'Very religious school',
        city: 'Ota',
        stateOrProvince: 'Ogun State',
        country: 'Nigeria',
      };
      const result = await schoolService.saveSchool(newSchool);

      expect(result.id.trim()).not.toBe('');
      expect(result.city).toBe(newSchool.city);
      expect(result.country).toBe(newSchool.country);
      expect(result.stateOrProvince).toBe(newSchool.stateOrProvince);
      expect(result.description).toBe(newSchool.description);
    });
  });

  describe('querySchoolByWildCard', () => {
    let newSchools: SaveSchoolCommand[];
    beforeEach(async () => {
      newSchools = [
        {
          name: 'University of Waterloo',
          description: 'Very Prestigious school in canada',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        },
        {
          name: 'Connestoga College',
          description: 'Very popular school in waterloo',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Fake',
        },
        {
          name: 'Wilfred Laurier University',
          description: 'One of the better schools for business',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        },
      ];

      const saves: Promise<SaveSchoolResult>[] = [];
      for (let i = 0; i < newSchools.length; i++) {
        saves.push(
          (async () => await schoolService.saveSchool(newSchools[i]))()
        );
      }
      await Promise.all(saves);
    });
    test('SHOULD save an array of school WHEN given a valid list of schools', async () => {
      let result = await schoolService.querySchoolByWildCard('waterloo');
      expect(result.length).toBe(3);

      result = await schoolService.querySchoolByWildCard('Very');
      expect(result.length).toBe(2);

      result = await schoolService.querySchoolByWildCard('fake');
      expect(result.length).toBe(1);
    });
  });

  describe('getAllDomains', () => {
    test('SHOULD get all domains of a specific school WHEN give a valid ID', async () => {
      let newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious school in canada',
        country: 'Canada',
        stateOrProvince: 'Ontario',
        city: 'Waterloo',
      });
      const newDomains = [
        SchoolDomain.create({
          domain: '@uwaterloo.ca',
        }),
        SchoolDomain.create({
          domain: '@uwaterloo.edu.ca',
        }),
      ];

      newSchool = await schoolRepository.saveSchool(newSchool);

      for (const domain of newDomains) {
        await schoolRepository.addDomain(domain, newSchool);
      }

      const result = await schoolService.getAllDomains(newSchool.id);

      expect(result.length).toBe(newDomains.length);
    });
  });

  describe('updateSchool', () => {
    let newSchool: School;
    beforeEach(async () => {
      newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious University',
        city: 'Waterloo',
        stateOrProvince: 'Ontario',
        country: 'Canada',
      });

      newSchool = await schoolRepository.saveSchool(newSchool);
    });

    test('SHOULD throw an NotFoundException WHEN given an invalid id', async () => {
      const command: UpdateSchoolCommand = {
        id: uuidv4(),
        name: 'University of not Waterloo',
        description: 'Not Prestigious',
        city: 'Guelph',
        stateOrProvince: 'Ontario',
        country: 'Nigeria',
      };

      await expect(async () => {
        await schoolService.updateSchool(command);
      }).rejects.toThrowError(NotFoundException);
    });

    test('SHOULD update school WHEN given a valid id', async () => {
      const command: UpdateSchoolCommand = {
        id: newSchool.id,
        name: 'University of not Waterloo',
        description: 'Not Prestigious',
        city: 'Guelph',
        stateOrProvince: 'Ontario',
        country: 'Nigeria',
      };
      const result = await schoolService.updateSchool(command);

      expect(result.id).toBe(newSchool.id);
      expect(result.name).toBe(command.name);
      expect(result.description).toBe(command.description);
    });
  });
});
