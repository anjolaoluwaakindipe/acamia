import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, IUserService } from './user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository) private readonly userRepo: IUserRepository
  ) {}

  hello() {
    this.userRepo.findUserByEmail('hello');
  }
}
