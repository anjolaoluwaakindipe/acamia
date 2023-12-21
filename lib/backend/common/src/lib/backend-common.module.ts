import { Module } from '@nestjs/common';
import { AppConfigModule, IAppConfigService } from './config/config.module';
import { IUnitOfWorkService } from './persitence/interfaces/unitOfWork.service';
import { PersistenceModule } from './persitence';

@Module({
  imports: [AppConfigModule, PersistenceModule],
  controllers: [],
  providers: [],
  exports: [IUnitOfWorkService, IAppConfigService],
})
export class BackendCommonModule {}
