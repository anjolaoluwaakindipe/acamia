import { AppInjectionOptions, AppProvider } from '@acamia/backend-common';
import { User } from '@acamia/entities';
import { Provider } from '@nestjs/common';
import { CreateUserCommand, CreateUserResult } from './dto/user.service';

export const IUserService = Symbol('IUserService');

export const IUserRepository = Symbol('IUserRepository');

export function IUserServiceProvider(
  param: AppInjectionOptions<IUserService>
): Provider<IUserService> {
  return AppProvider(param, IUserService);
}

export function IUserRepositoryProvider(
  param: AppInjectionOptions<IUserRepository>
) {
  return AppProvider(param, IUserRepository);
}

/**
 * IUserService - interface for the user service
 * */
export interface IUserService {
  createUser(command: CreateUserCommand): CreateUserResult;
  getUserById(query: GetUserByIdQuery): GetUserByIdResult;
}

/**
 * IUserRepository interface for the user repository
 *
 **/
export interface IUserRepository {
  /**
   * Takes a user id and returns its correspoding user entity if it exists else returns null
   * @param id - user id
   * @returns A promise of the user entity or a null value
   * */
  findUserById(id: string): Promise<User | null>;

  /**
   * Takes a email and return its correspondign user entity if it exists else returns null
   * @param email - user email
   * @returns A promise of the user entity or a null value
   * */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * saves the user to the database or persistent storage
   * @param user - user entity to be saved
   * @returns The saved user
   * */
  saveUser(user: User): Promise<User>;

  /**
   * Takes a schoolId and returns a list of users associated with the corresponding id
   * @param schoolId - school ID
   * @returns List of users associated with school
   * */
  findUsersBySchool(schoolId: string): Promise<User[]>;

  /**
   * updates the user information with the corresponding id field with the values contained
   * in the user entity passed as input
   * @param user - user entity to be updated
   * @returns The updated user
   * */
  updateUser(user: User): Promise<User>;
}
