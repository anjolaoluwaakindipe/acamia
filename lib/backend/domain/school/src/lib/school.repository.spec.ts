import { PersistenceModule } from '@acamia/backend-common';
import { School, SchoolDomain } from '@acamia/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from 'lib/backend/common/src/lib/config/config.module';
import { EntityManager } from 'typeorm';
import {
  ISchoolRepository,
  ISchoolRepositoryProvider,
} from './school.interface';
import { SchoolRepository } from './school.repository';
import { v4 as uuidv4 } from 'uuid';

describe('SCHOOL REPOSITORY TEST', () => {
  let manager: EntityManager;
  let app: TestingModule;
  let schoolRepository: ISchoolRepository;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PersistenceModule, AppConfigModule],
      providers: [ISchoolRepositoryProvider({ useClass: SchoolRepository })],
    }).compile();
    manager = app.get<EntityManager>(EntityManager);
    schoolRepository = app.get<ISchoolRepository>(ISchoolRepository);
  });

  afterEach(async () => {
    await manager.getRepository(School).clear();
  });

  describe('saveSchool', () => {
    test('SHOULD save a school WHEN given a school entity', async () => {
      const newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious school in canada',
        country: 'Canada',
        stateOrProvince: 'Ontario',
        city: 'Waterloo',
      });
      await schoolRepository.saveSchool(newSchool);

      const result = await manager
        .getRepository(School)
        .findOne({ where: { name: newSchool.name } });

      expect(result).not.toBeNull();
      expect(result?.id).not.toBeNull();
      expect(result?.name).toEqual(newSchool.name);
      expect(result?.description).toEqual(newSchool.description);
      expect(result?.city).toEqual(newSchool.city);
      expect(result?.stateOrPronvince).toEqual(newSchool.stateOrPronvince);
      expect(result?.country).toEqual(newSchool.country);
    });
  });

  describe('saveSchools', () => {
    test('SHOULD saves an array of schools WHEN given an array of school entities', async () => {
      const newSchools = [
        School.create({
          name: 'University of Waterloo',
          description: 'Very Prestigious school in canada',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
        School.create({
          name: 'Connestoga College',
          description: 'Very popular school in waterloo',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Fake',
        }),
        School.create({
          name: 'Wilfred Laurier University',
          description: 'One of the better schools for business',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
      ];

      await schoolRepository.saveSchools(newSchools);

      const schools = await manager
        .getRepository(School)
        .find({ order: { created_at: { direction: 'asc' } } });

      expect(schools.length).toBe(3);

      for (let i = 0; i < schools.length; i++) {
        const school = schools[i];
        const check = newSchools[i];
        expect(school).not.toBeNull();
        expect(school.id.trim()).not.toBe('');
        expect(school.id).not.toBeNull();
        expect(school.name).toEqual(check.name);
        expect(school.description).toEqual(check.description);
        expect(school.city).toEqual(check.city);
        expect(school.stateOrPronvince).toEqual(check.stateOrPronvince);
        expect(school.country).toEqual(check.country);
      }
    });
  });

  describe('findSchoolByWildCard', () => {
    let newSchools: School[];
    beforeEach(async () => {
      newSchools = [
        School.create({
          name: 'University of Waterloo',
          description: 'Very Prestigious school in canada',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
        School.create({
          name: 'Connestoga College',
          description: 'Very popular school in waterloo',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Fake',
        }),
        School.create({
          name: 'Wilfred Laurier University',
          description: 'One of the better schools for business',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
      ];

      await schoolRepository.saveSchools(newSchools);
    });

    test('SHOULD query school by description, name, and location WHEN given a valid query', async () => {
      const result1 = await schoolRepository.findSchoolByWildCard('waterloo');
      expect(result1.length).toBe(newSchools.length);

      const result2 = await schoolRepository.findSchoolByWildCard('University');
      expect(result2.length).toBe(2);

      const result3 = await schoolRepository.findSchoolByWildCard('London');
      expect(result3.length).toBe(0);
    });
  });

  describe('findSchoolById', () => {
    let newSchools: School[];
    beforeEach(async () => {
      newSchools = [
        School.create({
          name: 'University of Waterloo',
          description: 'Very Prestigious school in canada',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
        School.create({
          name: 'Connestoga College',
          description: 'Very popular school in waterloo',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Fake',
        }),
        School.create({
          name: 'Wilfred Laurier University',
          description: 'One of the better schools for business',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
      ];

      newSchools = await schoolRepository.saveSchools(newSchools);
    });

    test('SHOULD return a school WHEN a valid id is given', async () => {
      const result = await schoolRepository.findSchoolById(newSchools[0].id);
      expect(result).not.toBeNull();
      expect(result?.name).toBe(newSchools[0].name);
      expect(result?.description).toBe(newSchools[0].description);
      expect(result?.city).toBe(newSchools[0].city);
    });

    test('SHOULD return null WHEN an invalid id is given', async () => {
      const result = await schoolRepository.findSchoolById(uuidv4());
      expect(result).toBeNull();
    });
  });

  describe('getSchoolDomainById', () => {
    let newSchools: School[];
    beforeEach(async () => {
      newSchools = [
        School.create({
          name: 'University of Waterloo',
          description: 'Very Prestigious school in canada',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
        School.create({
          name: 'Connestoga College',
          description: 'Very popular school in waterloo',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Fake',
        }),
        School.create({
          name: 'Wilfred Laurier University',
          description: 'One of the better schools for business',
          country: 'Canada',
          stateOrProvince: 'Ontario',
          city: 'Waterloo',
        }),
      ];

      newSchools = await schoolRepository.saveSchools(newSchools);
    });
    test('SHOULD return a school domain with the correct school WHEN given a valid ID', async () => {
      let newDomain = SchoolDomain.create({
        domain: '@waterloo.ca',
      });

      newDomain = await schoolRepository.addDomain(newDomain, newSchools[0]);

      expect(newDomain.school.id).toBe(newSchools[0].id);
    });

    test('SHOULD save multiple domains to a specific school', async () => {
      const newDomains = [
        SchoolDomain.create({
          domain: '@uwaterloo.ca',
        }),
        SchoolDomain.create({
          domain: '@uwaterloo.edu.ca',
        }),
      ];

      for (const domain of newDomains) {
        await schoolRepository.addDomain(domain, newSchools[0]);
      }

      const domains = await manager
        .getRepository(SchoolDomain)
        .find({ where: { school: { id: newSchools[0].id } } });

      expect(domains.length).toBe(2);
    });
  });

  describe('deleteSchoolDomainById', () => {
    let newSchool: School;
    let newDomains: SchoolDomain[];
    beforeEach(async () => {
      newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious school in canada',
        country: 'Canada',
        stateOrProvince: 'Ontario',
        city: 'Waterloo',
      });
      newSchool = await schoolRepository.saveSchool(newSchool);
      newDomains = [
        SchoolDomain.create({
          domain: '@uwaterloo.ca',
        }),
        SchoolDomain.create({
          domain: '@uwaterloo.edu.ca',
        }),
      ];

      for (let i = 0; i < newDomains.length; i++) {
        newDomains[i] = await schoolRepository.addDomain(
          newDomains[i],
          newSchool
        );
      }
    });

    test('SHOULD delete a specific domain WHEN give a valid ID', async () => {
      await schoolRepository.deleteSchoolDomainById(newDomains[0].id);

      const domains = await manager
        .getRepository(SchoolDomain)
        .find({ where: { school: { id: newSchool.id } } });

      expect(domains.length).toBe(newDomains.length - 1);
    });

    test('SHOULD delete nothing WHEN given an invalid ID', async () => {
      await schoolRepository.deleteSchoolDomainById(uuidv4());

      const domains = await manager
        .getRepository(SchoolDomain)
        .find({ where: { school: { id: newSchool.id } } });

      expect(domains.length).toBe(newDomains.length);
    });
  });

  describe('findSchoolDomainById', () => {
    let newSchool: School;
    let newDomains: SchoolDomain[];
    beforeEach(async () => {
      newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious school in canada',
        country: 'Canada',
        stateOrProvince: 'Ontario',
        city: 'Waterloo',
      });
      newSchool = await schoolRepository.saveSchool(newSchool);
      newDomains = [
        SchoolDomain.create({
          domain: '@uwaterloo.ca',
        }),
        SchoolDomain.create({
          domain: '@uwaterloo.edu.ca',
        }),
      ];

      for (let i = 0; i < newDomains.length; i++) {
        newDomains[i] = await schoolRepository.addDomain(
          newDomains[i],
          newSchool
        );
      }
    });

    test('SHOULD get the correct schoolDomain WHEN given a valid ID', async () => {
      const foundDomain = await schoolRepository.findSchoolDomainById(
        newDomains[0].id
      );

      expect(foundDomain).not.toBeNull();
      expect(foundDomain?.schoolId).toBe(newSchool.id);
      expect(foundDomain?.domain).toBe(newDomains[0].domain);
    });

    test('SHOULD return  null WHEN given an invalid ID', async () => {
      const foundDomain = await schoolRepository.findSchoolDomainById(uuidv4());

      expect(foundDomain).toBeNull();
    });
  });

  describe('updateSchool', () => {
    let newSchool: School;
    beforeEach(async () => {
      newSchool = School.create({
        name: 'University of Waterloo',
        description: 'Very Prestigious school in canada',
        country: 'Canada',
        stateOrProvince: 'Ontario',
        city: 'Waterloo',
      });
      newSchool = await schoolRepository.saveSchool(newSchool);
    });

    test('SHOULD update a school WHEN given an existing school', async () => {
      newSchool.city = 'Chicago';
      newSchool.country = 'United States of America';
      newSchool.stateOrPronvince = 'Illinois';
      newSchool.name = 'Illinois State University';

      const updatedSchool = await schoolRepository.updateSchool(newSchool);

      expect(updatedSchool.id);
      expect(updatedSchool.city).toBe(newSchool.city);
      expect(updatedSchool.country).toBe(newSchool.country);
      expect(updatedSchool.stateOrPronvince).toBe(newSchool.stateOrPronvince);
      expect(updatedSchool.name).toBe(newSchool.name);
    });
  });
});
