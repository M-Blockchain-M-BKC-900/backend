import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '30 day' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
