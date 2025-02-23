import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [
    AuthModule,
    UsersModule
  ]
})
export class UploadsModule {}
