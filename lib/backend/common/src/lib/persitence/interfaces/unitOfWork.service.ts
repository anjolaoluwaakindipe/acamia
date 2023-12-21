import { Provider } from '@nestjs/common';
import { AppInjectionOptions } from '../../util/app.provider';

export interface IUnitOfWorkService<T> {
  getManager(): T;
  doTransaction<R>(fn: () => Promise<R>): Promise<R>;
}

export const IUnitOfWorkService = Symbol('IUnitOfWorkService');

export function IUnitOfWorkServiceProvider<T>(
  params: AppInjectionOptions<IUnitOfWorkService<T>>
): Provider<IUnitOfWorkService<T>> {
  return {
    ...params,
    provide: IUnitOfWorkService,
  };
}
