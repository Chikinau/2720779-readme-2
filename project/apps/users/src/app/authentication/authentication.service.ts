import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@project/shared-types';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // Регистрация
  public async register(dto: CreateUserDto): Promise<User> {
    if (await this.userRepository.exists(dto.email)) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = new UserEntity({
      id: '',
      email: dto.email,
      name: dto.name,
      role: UserRole.User,
      avatar: dto.avatar,
      createdAt: new Date(),
      passwordHash: '',
    });

    await user.setPassword(dto.password);
    const savedUser = await this.userRepository.save(user);
    return this.toPublic(savedUser);
  }

  // Вход
  public async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValid = await user.comparePassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { ...this.toPublic(user), accessToken };
  }

  // Детальная информация
  public async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.toPublic(user);
  }

  // Вырезаем passwordHash — клиент его не должен видеть
  private toPublic(entity: UserEntity): User {
    const { passwordHash, ...rest } = entity.toPOJO();
    return rest;
  }
}
