import { AppInjectionOptions } from '@acamia/backend-common';
import { School, SchoolDomain } from '@acamia/entities';
import { Provider } from '@nestjs/common';
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

/**
 * Service reponsible for school
 */
export interface ISchoolService {
  /**
   * Takes a query and returns schools with either a name, description,or location that
   * matches the query as a wildcard
   * @param query query that will be used as a wildcard
   * @returns {QuerySchoolByWildCardResult}
   */
  querySchoolByWildCard(query: string): Promise<QuerySchoolByWildCardResult>;

  /**
   * Takes in a SaveSchoolCommand and saves the command as a School in the database.
   * @param command
   */
  saveSchool(command: SaveSchoolCommand): Promise<SaveSchoolResult>;

  /**
   * Takes an UpdateSchoolCommand and uses the id of the school in the command to update a school.
   * If a school does not exist then a NotFoundException will be thrown
   * @throws{NotFoundException}
   * @param command
   */
  updateSchool(command: UpdateSchoolCommand): Promise<UpdateSchoolResult>;

  /**
   * Takes a school domain and a school ID and adds that domain to the specific school.
   * If the school does not exists it will throw a NotFoundException
   * @throws {NotFoundException}
   * @param {AddDomainCommand} command
   */
  addDomain(command: AddDomainCommand): Promise<void>;

  /**
   * Gets all domains from a specific school by their school IDs. Throws a NotFoundException
   * if the school does not exist
   *
   * @throws {NotFoundException}
   * @param {GetDomainsBySchoolIdQuery} query - id of the school that the domains belogn to
   */
  getAllDomains(
    query: GetDomainsBySchoolIdQuery
  ): Promise<GetDomainsBySchoolIdResult>;

  /**
   * This deletes a specific school domain by it's own id. Throws a NotFoundException
   * if the school does not exist
   * @param {DeleteDomainCommand} command
   */
  deleteDomain(command: DeleteDomainCommand): Promise<void>;
}

/**
 * Repository for interfacing with any database client responsible for
 * school entity
 */
export interface ISchoolRepository {
  /**
   * Takes a query and returns schools with either a name, description,or location that
   * matches the query as a wildcard
   * @async
   * @param {string} query - query that will be used as a wildcard
   */
  findSchoolByWildCard(query: string): Promise<School[]>;

  /**
   * Takes a school and saves it to the database
   * @async
   * @param {School} school - school object to be saved
   */
  saveSchool(school: School): Promise<School>;

  /**
   * Takes a school and updates it in the database
   * @param {School} school
   */
  updateSchool(school: School): Promise<School>;

  /**
   * Takes an array of schools and saves them to the database
   * @async
   * @param {School} schools - an array of schools
   */
  saveSchools(schools: School[]): Promise<School[]>;

  /**
   * Finds a school by its id and returns. Will return null if no school with such
   * id exists
   * @async
   * @param {string} schoolId
   */
  findSchoolById(schoolId: string): Promise<School | null>;

  /**
   * Adds a domain to a specific school and saves the connection.
   * @param {SchoolDomain} schoolDomain
   * @param {School} school - This must be an existing school in the database or else a new school will be created
   */
  addDomain(schoolDomain: SchoolDomain, school: School): Promise<SchoolDomain>;

  /**
   * Gets all domains that belongs to a specific school
   * @param schoolId - ID of school
   *
   * */
  getAllDomainsBySchoolId(schoolId: string): Promise<SchoolDomain[]>;

  /**
   * Get SchoolDomain by id. Returns null if no school domain exists
   * @param schoolDomain
   */
  findSchoolDomainById(schoolDomain: string): Promise<SchoolDomain | null>;

  /**
   * This takes a school domain id and deletes it form the database
   * @param {string} schoolDomainId
   */
  deleteSchoolDomainById(schoolDomainId: string): Promise<void>;
}

/**
 * Symbol for ISchoolService
 */
export const ISchoolService = Symbol('ISchoolService');

/**
 * Symbol for ISchoolRepository
 */
export const ISchoolRepository = Symbol('ISchoolRepository');

/**
 * returns a provdier that implements the ISchoolService interface
 * @param {AppInjectionOptions} param - any InjectionOptions that is of the type ISchoolService
 * @returns
 */
export function ISchoolServiceProvider(
  param: AppInjectionOptions<ISchoolService>
): Provider<ISchoolService> {
  return {
    ...param,
    provide: ISchoolService,
  };
}

/**
 * return a provider that implements the ISchoolRepository interface
 * @param {AppInjectionOptions} param - any InjectionOptions that is of the type ISchoolRepository
 * @returns
 */
export function ISchoolRepositoryProvider(
  param: AppInjectionOptions<ISchoolRepository>
): Provider<ISchoolRepository> {
  return {
    ...param,
    provide: ISchoolRepository,
  };
}
