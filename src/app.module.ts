import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XrpLedgerModule } from './xrp-ledger/xrp-ledger.module';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    XrpLedgerModule,
    ConfigModule.forRoot(),
    NftModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
