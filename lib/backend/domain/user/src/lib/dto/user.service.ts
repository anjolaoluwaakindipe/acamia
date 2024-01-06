import { RoleTypes } from '@acamia/entities';

export type CreateUserCommand = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleTypes;
};

export type CreateUserResult = {
  firstName: string;
  lastName: string;
  email: string;
};

export type GetUserByIdQuery = string;

export type GetuserByIdResult = {
  firstName: string;
  lastName: string;
  email: string;

  role: Set<RoleTypes>;
};
