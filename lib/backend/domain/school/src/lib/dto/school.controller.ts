import { IsNotEmpty, IsString } from 'class-validator';

export class SaveSchoolRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  stateOrProvince: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class SaveSchoolResponse {
  id: string;
  name: string;
  description: string;
  city: string;
  stateOrProvince: string;
  country: string;

  static create(param: {
    id: string;
    name: string;
    description: string;
    city: string;
    stateOrProvince: string;
    country: string;
  }) {
    const instance = new SaveSchoolResponse();
    instance.id = param.id;
    instance.name = param.name;
    instance.description = param.description;
    instance.city = param.city;
    instance.stateOrProvince = param.stateOrProvince;
    instance.country = param.country;
    return instance;
  }
}

export class AddDomainRequest {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  schoolDomain: string;
}

export class AddDomainResponse {
  id: string;
  domain: string;

  static create(param: { id: string; domain: string }) {
    const instance = new AddDomainResponse();
    instance.id = param.id;
    instance.domain = param.domain;
    return instance;
  }
}
