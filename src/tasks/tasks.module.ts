import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
    UsersModule,
    ProjectsModule
  ],
  exports:[
    TasksService
  ]
})
export class TasksModule {}
