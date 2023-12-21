import { Global, Injectable, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync, IsString, IsEnum } from 'class-validator';
import { AppInjectionOptions } from '../util/app.provider';
import { resolve as pathResolve } from 'path';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}
export class EnvironmentVariables {
  @IsString()
  PG_DATABASE_URL!: string;

  @IsEnum(Environment)
  NODE_ENV!: Environment;
}

export function validate(config: Record<string, unknown>) {
  console.log(process.env['NODE_ENV']);
  console.log(pathResolve(__dirname, '../../../../../../'));
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

@Injectable()
export class AppConfigService implements IAppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}
  getPGDatabaseUrl(): string {
    return this.configService.get('PG_DATABASE_URL');
  }

  getNodeEnv(): Environment {
    return this.configService.get('NODE_ENV');
  }
}

export interface IAppConfigService {
  getPGDatabaseUrl(): string;
  getNodeEnv(): Environment;
}

export const IAppConfigService = Symbol('IAppConfigService');

export function IAppConfigServiceProvider(
  param: AppInjectionOptions<IAppConfigService>
): Provider<IAppConfigService> {
  return {
    ...param,
    provide: IAppConfigService,
  };
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env['NODE_ENV'] === 'production',
      envFilePath: `${pathResolve(__dirname, '../../../../../../')}/.env${
        process.env['NODE_ENV'] ? '.' + process.env['NODE_ENV'] : ''
      }`,
      cache: true,
      validate,
    }),
  ],
  providers: [IAppConfigServiceProvider({ useClass: AppConfigService })],
  exports: [IAppConfigService],
})
export class AppConfigModule {}
