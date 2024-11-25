import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { authToken } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    response.cookie('authToken', authToken, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });

    return {
      authToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('authToken');

    return { message: 'Successfully signed out' };
  }

  @Get('check')
  async checkAuthStatus(@Req() request: Request) {
    const authToken = request.cookies['authToken'];

    if (!authToken) {
      throw new UnauthorizedException('Auth token is missing');
    }

    return { isAuthenticated: this.authService.validateToken(authToken) };
  }
}
