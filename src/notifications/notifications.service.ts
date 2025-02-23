import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {

  constructor(

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    private readonly usersService: UsersService,
    private readonly tasksService: TasksService

  ){}

  async create(createNotificationDto: CreateNotificationDto) {

    const { id_task, id_user } = createNotificationDto;
      
    const task = await this.tasksService.findOne(id_task);
    const user = await this.usersService.findOne(id_user);

    if(!task){
      throw new NotFoundException(`Task with id: ${id_task} not found.`);
    }

    if(!user){
      throw new NotFoundException(`User with id: ${id_user} not found.`);
    }


    try{
      
      const notification = this.notificationRepository.create({
        id_task: task,
        id_user: user
      });

      return await this.notificationRepository.save(notification);


    }catch(error){
      
      this.handleDBError(error);

    }


  }

  async notificationsUser(id_user: number){

    const user = await this.usersService.findOne(id_user);

    if(!user){
      throw new NotFoundException(`User with id: ${id_user} not found.`);
    }

    try{

      const notifications = await this.notificationRepository.find({
        where: {id_user: user, active: 1},
        take: 5,
        order: {create_at: 'DESC'}
      });

      return notifications;

      
    }catch(error){
      this.handleDBError(error);
    }

  }

  async checkViewNotification(id: number){

    const notification = await this.findOne(id);

    try {
      
      const updNotification = await this.notificationRepository.preload({
        id: notification.id,
        active: 0
      })

      return await this.notificationRepository.save(updNotification);

    }catch(error){
      this.handleDBError(error);
    }

  }

  async findOne(id: number){

    const notification = await this.notificationRepository.findOneBy({id: id})

    if(!notification){
      throw new NotFoundException(`Notification id: ${id} not found.`);
    }

    return notification;

  }

  findAll() {
    return `This action returns all notifications`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  private handleDBError(error: any){
    
    if(error.sqlState === '23000'){

      console.log(error);
      throw new BadRequestException(`The User already exist.`);

    }else{

      console.log(error);
      throw new InternalServerErrorException(`Please check the server log.`);
      
    }

  }

}
