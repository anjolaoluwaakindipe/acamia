import { Global, Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Environment, IAppConfigService } from '../config/config.module';
import { Course, Department, School, SchoolDomain } from '@acamia/entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [IAppConfigService],
      useFactory: async (config: IAppConfigService) => {
        if (config.getNodeEnv() === Environment.Test){
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            dropSchema: true,
            entities: [School,Course,Department, SchoolDomain],
            synchronize: true,
            // logging: true,
            name: 'testConnectioin',
            
          }
        }
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'anjolaoluwaakindipe',
          password: 'akindipe',
          database: 'acamia',
          entities: [],
          synchronize: false,
        };
      },
    }),
  ],

  exports: [TypeOrmModule],
})
export class AppTypeOrmModule {}
