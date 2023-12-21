import { Module } from '@nestjs/common';
import { AppTypeOrmModule } from './typeorm.service';
import {
  IUnitOfWorkService,
  IUnitOfWorkServiceProvider,
} from './interfaces/unitOfWork.service';
import { UnitOfWorkServiceTypeorm } from './unitOfWork.service';

@Module({
  imports: [AppTypeOrmModule],
  providers: [
    IUnitOfWorkServiceProvider({ useClass: UnitOfWorkServiceTypeorm }),
  ],
  exports: [IUnitOfWorkService],
})
export class PersistenceModule {}
