import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthGuard
  ],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: {expiresIn: '2h'}
    }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {

    //     return {
    //       secret: configService.get('JWT_SEED'),
    //       signOptions: {
    //         expiresIn: '2h'
    //       }
    //     }

    //   }
    // }),
    UsersModule
  ],
  exports: [
    AuthService, 
    AuthGuard
  ]
})
export class AuthModule {}
