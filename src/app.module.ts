import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XrpLedgerModule } from './modules/xrp-ledger/xrp-ledger.module';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [XrpLedgerModule, ConfigModule.forRoot(), NftModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
