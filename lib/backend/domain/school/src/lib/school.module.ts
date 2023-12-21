import { Module } from '@nestjs/common';
import {
  ISchoolRepositoryProvider,
  ISchoolService,
  ISchoolServiceProvider,
} from './school.interface';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { SchoolRepository } from './school.repository';

@Module({
  controllers: [SchoolController],
  providers: [
    ISchoolServiceProvider({ useClass: SchoolService }),
    ISchoolRepositoryProvider({ useClass: SchoolRepository }),
  ],
  exports: [ISchoolService],
})
export class SchoolModule {}
