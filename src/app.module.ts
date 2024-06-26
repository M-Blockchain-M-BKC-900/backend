import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nft/nft.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), NftModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
