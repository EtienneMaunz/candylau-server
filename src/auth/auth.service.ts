import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ authToken: string }> {
    const user = await this.usersService.findByName(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authToken = this.jwtService.sign(
      {
        username,
      },
      { expiresIn: '1d', secret: process.env.AUTH_SECRET },
    );

    return { authToken };
  }

  validateToken(token: string) {
    try {
      this.jwtService.verify(token, {
        secret: process.env.AUTH_SECRET,
      }); // This will throw if the token is invalid/expired
      return true;
    } catch {
      return false;
    }
  }
}
