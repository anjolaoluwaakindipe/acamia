import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './user.interface';
import { IUnitOfWorkService } from '@acamia/backend-common';
import { User } from '@acamia/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(IUnitOfWorkService)
    private readonly uowService: IUnitOfWorkService<EntityManager>
  ) {}

  findUserById(id: string): Promise<User | null> {
    return this.uowService
      .getManager()
      .getRepository(User)
      .findOne({ where: { id: id } });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.uowService
      .getManager()
      .getRepository(User)
      .findOne({ where: { email: email } });
  }
  saveUser(user: User): Promise<User> {
    return this.uowService.getManager().getRepository(User).save(user);
  }
  findUsersBySchool(schoolId: string): Promise<User[]> {
    return this.uowService
      .getManager()
      .getRepository(User)
      .find({ where: { id: schoolId } });
  }
  updateUser(user: User): Promise<User> {
    return this.uowService.getManager().getRepository(User).save(user);
  }
}
