import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { Wallet } from 'xrpl';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

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

  async create(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post('https://faucet.altnet.rippletest.net/accounts'),
    );
    return data;
  }
}
