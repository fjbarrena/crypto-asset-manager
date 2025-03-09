import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './dtos/create_user.request';
import { BcryptService } from '../security/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(request: CreateUserRequest): Promise<any> {
    const user = this.userRepository.create({
      username: request.username,
      encryptedPassword: BcryptService.hashPassword(request.plainPassword),
      role: request.role,
    });
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User> {
    const res = await this.userRepository.find({
      where: {
        username: username,
      },
    });

    return res[0];
  }
}
