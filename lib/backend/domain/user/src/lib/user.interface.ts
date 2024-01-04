import { AppInjectionOptions, AppProvider } from '@acamia/backend-common';
import { Provider } from '@nestjs/common';

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

export interface IUserService {}

export interface IUserRepository {}
