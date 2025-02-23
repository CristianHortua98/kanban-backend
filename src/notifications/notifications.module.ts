import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    AuthModule,
    UsersModule,
    TasksModule
  ]
})
export class NotificationsModule {}
