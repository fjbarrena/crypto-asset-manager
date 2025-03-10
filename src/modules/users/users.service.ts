import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './dtos/create_user.request';
import { BcryptService } from '../security/bcrypt.service';
import { UserResponse } from './dtos/user.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    const dirtyCreate = this.userRepository.create({
      username: request.username,
      encryptedPassword: BcryptService.hashPassword(request.plainPassword),
      role: request.role,
      balance: request.initialBalance,
    });

    const user = await this.userRepository.save(dirtyCreate);

    return UserResponse.fromEntity(user);
  }

  async findByUsername(username: string): Promise<User> {
    const res = await this.userRepository.find({
      where: { username },
    });

    return res[0];
  }

  async findById(id: string): Promise<User> {
    const res = await this.userRepository.find({
      where: { id },
    });

    return res[0];
  }
}
