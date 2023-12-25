export type QuerySchoolByWildCardResult = {
  id: string;
  name: string;
}[];

export type SaveSchoolCommand = {
  name: string;
  description: string;
  city: string;
  stateOrProvince: string;
  country: string;
};

export type SaveSchoolResult = {
  id: string;
  name: string;
  description: string;
  city: string;
  stateOrProvince: string;
  country: string;
};

export type UpdateSchoolCommand = {
  id: string;
  name: string;
  description: string;
  city: string;
  stateOrProvince: string;
  country: string;
};

export type UpdateSchoolResult = {
  id: string;
  name: string;
  description: string;
  city: string;
  stateOrProvince: string;
  country: string;
};

export type AddDomainCommand = {
  schoolId: string;
  schoolDomain: string;
};

export type GetDomainsBySchoolIdQuery = string;

export type GetDomainsBySchoolIdResult = {
  domain: string;
  id: string;
}[];

export type DeleteDomainCommand = string;
