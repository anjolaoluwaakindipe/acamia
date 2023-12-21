import { Provider, InjectionToken } from '@nestjs/common';
import {
  ValueProvider,
  ClassProvider,
  FactoryProvider,
  ExistingProvider,
} from '@nestjs/common';

export type AppInjectionOptions<T> =
  | Omit<ValueProvider<T>, 'provide'>
  | Omit<ClassProvider<T>, 'provide'>
  | Omit<FactoryProvider<T>, 'provide'>
  | Omit<ExistingProvider<T>, 'provider'>;

export function AppProvider<T>(
  params: AppInjectionOptions<T>,
  token: InjectionToken
): Provider<T> {
  return {
    ...params,
    provide: token,
  };
}
