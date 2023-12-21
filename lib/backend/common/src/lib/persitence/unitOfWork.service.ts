import { EntityManager } from 'typeorm';
import { IUnitOfWorkService } from './interfaces/unitOfWork.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({scope: Scope.DEFAULT})
export class UnitOfWorkServiceTypeorm
  implements IUnitOfWorkService<EntityManager>
{
  constructor(@InjectEntityManager() private manager:EntityManager) {}
  getManager() {
    return this.manager;
  }
  doTransaction<R>(callback: () => Promise<R>): Promise<R> {
    const previousManager = this.manager;
    const result = this.manager.transaction(
      async (transactionEntityManager) => {
        this.manager = transactionEntityManager;
        return await callback();
      }
    );
    this.manager = previousManager;
    return result;
  }
}
