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
import { School } from '@acamia/entities';
import { SaveSchoolCommand, SaveSchoolResult } from './dto/school.service';

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
    let newSchools: SaveSchoolCommand[]
    beforeEach(async()=>{
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
        }
      ];
      
      const saves:Promise<SaveSchoolResult>[] = []
      for (let i =0 ; i < newSchools.length; i++){
        saves.push((async()=> await schoolService.saveSchool(newSchools[i]))())
      }
      await Promise.all(saves)
    })
    test('SHOULD save an array of school WHEN given a valid list of schools', async () => {
        const result = await schoolService.querySchoolByWildCard("waterloo")

        expect(result.length).toBe(3)
    });
  });
});
