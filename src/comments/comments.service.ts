import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {

  constructor(

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService

  ){}

  async create(createCommentDto: CreateCommentDto) {

    const { id_task, id_user, message } = createCommentDto;

    const user = await this.usersService.findOne(id_user);
    const task = await this.tasksService.findOne(id_task);

    if(!user){
      throw new NotFoundException(`User with id: ${id_user} not found.`);
    }

    if(!task){
      throw new NotFoundException(`Task with id: ${id_task} not found.`);
    }

    const comment = this.commentRepository.create({
      message,
      user_created: user,
      task
    });

    try{

      return await this.commentRepository.save(comment);
      
    }catch(error){
      this.handleDBError(error);
    }


  }

  async allCommentsTask(idTask: number){

    const task = await this.tasksService.findOne(idTask);

    if(!task){
      throw new NotFoundException(`Task with id: ${idTask} not found.`);
    }

    return await this.commentRepository.find({
      where: {task, is_active: 1},
      order: {create_at: 'DESC'}
    });

  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }

  private handleDBError(error: any){
      
    if(error.sqlState === '23000'){

      console.log(error);
      throw new BadRequestException(`The Comment already exist.`);

    }else{

      console.log(error);
      throw new InternalServerErrorException(`Please check the server log.`);
      
    }

  }

}
