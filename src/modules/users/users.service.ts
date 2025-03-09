import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './dtos/create_user.request';
import { BcryptService } from '../security/bcrypt.service';
import { makeFailure, makeSuccess, Result } from 'src/model/result.model';

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
      balance: request.initialBalance
    });
    return this.userRepository.save(user);
  }

  async updateBalance(userId: string, amount: number): Promise<Result<boolean, HttpException>> {
    const user = await this.findById(userId);

    const newBalance = user.balance + amount

    const updateResult = await this.userRepository.update({id: user.id}, {balance: newBalance})
    
    if(updateResult.affected === 1) {
      return makeSuccess(true)
    } else {
      return makeFailure(new NotFoundException(`User ${userId} not found`))
    }

  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
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
