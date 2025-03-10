import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async createUser(
    request: CreateUserRequest,
  ): Promise<Result<User, HttpException>> {
    try {
      const dirtyCreate = this.userRepository.create({
        username: request.username,
        encryptedPassword: BcryptService.hashPassword(request.plainPassword),
        role: request.role,
        balance: request.initialBalance,
      });

      const user = await this.userRepository.save(dirtyCreate);

      return makeSuccess(user);
    } catch (e) {
      Logger.error(`Error creating user`, e);
      return makeFailure(new InternalServerErrorException(e));
    }
  }

  async findByUsername(username: string): Promise<Result<User, HttpException>> {
    try {
      const res = await this.userRepository.find({
        where: { username },
      });

      if (res.length === 0) {
        return makeFailure(
          new NotFoundException(`User with username ${username} not found`),
        );
      }

      return makeSuccess(res[0]);
    } catch (e) {
      Logger.error(`Error at findByUsername for username ${username}`, e);
      return makeFailure(new InternalServerErrorException(e));
    }
  }

  async findById(id: string): Promise<Result<User, HttpException>> {
    try {
      const res = await this.userRepository.find({
        where: { id },
      });

      if (res.length === 0) {
        return makeFailure(
          new NotFoundException(`User with id ${id} not found`),
        );
      }

      return makeSuccess(res[0]);
    } catch (e) {
      Logger.error(`Error at findByUsername for username ${id}`, e);
      return makeFailure(new InternalServerErrorException(e));
    }
  }
}
