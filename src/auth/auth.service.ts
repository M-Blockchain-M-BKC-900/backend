import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(seed: string): Promise<{ access_token: string }> {
    if (!(await this.usersService.check(seed)))
      throw new UnauthorizedException();
    const payload = { seed: seed };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
