import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Wallet } from 'xrpl';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(seed: string): Promise<{ access_token: string }> {
    try {
      Wallet.fromSeed(seed);
    } catch (error) {
      throw new UnauthorizedException();
    }
    const payload = { seed: seed };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
