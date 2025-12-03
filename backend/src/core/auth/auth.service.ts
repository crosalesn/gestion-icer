import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FindUserByEmailUseCase } from '../users/application/use-cases/find-user-by-email.use-case';
import { LoginDto } from './presentation/dto/login.dto';
import { User } from '../users/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findUserByEmailUseCase.execute(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }
}

