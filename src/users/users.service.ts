import { Injectable } from '@nestjs/common';
import { Wallet } from 'xrpl';

@Injectable()
export class UsersService {
  async check(seed: string): Promise<boolean> {
    try {
      Wallet.fromSeed(seed);
    } catch (error) {
      return false;
    }
    return true;
  }
}
