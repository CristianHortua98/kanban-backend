import { UsersService } from './../users/users.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { PaginationTaskStateDto } from 'src/common/dtos/pagination-task-state.dto';
import { AssignedUserTaskDto } from './dto/assigned-user-task.dto';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { query } from 'express';
import { TasksPaginationDto } from 'src/common/dtos/task-pagination.dto';

@Injectable()
export class TasksService {

  constructor(

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService

  ){}

  async create(request: Request, createTaskDto: CreateTaskDto){

    const { project_id, ...dataTask } = createTaskDto;

    if(!request['user']){
      throw new UnauthorizedException(`Therer is not a Bearer Token`);
    }

    const userSesion: User = request['user'];

    const project = await this.projectsService.findOne(project_id);

    if(!project){
      throw new NotFoundException(`Project id: ${project_id} not found.`);
    }

    try{

      const task = this.taskRepository.create({
        user_created: userSesion,
        project_id: project,
        ...dataTask
      });

      return await this.taskRepository.save(task);

    }catch(error){
      
      console.log(error);
      this.handleDBError(error);

    }

  }

  async assignedUserTask(assignedUserTaskDto:AssignedUserTaskDto){

    const { id_task, id_user } = assignedUserTaskDto;

    const user = await this.usersService.findOne(id_user);
    const task = await this.findOne(id_task);

    if(!task){
      throw new NotFoundException(`Task with id: ${id_task} not found.`);
    }

    
    const updTask = await this.taskRepository.preload({
      id: task.id,
      user_assigned: user
    })
    
    try {

      return await this.taskRepository.save(updTask);

    }catch(error){

      this.handleDBError(error);

    }
    

  }

  async changeTaskStatus(changeTaskStatusDto: ChangeTaskStatusDto){

    const { id_task, status } = changeTaskStatusDto;

    const task = await this.findOne(id_task);

    if(!task){
      throw new NotFoundException(`Task with id: ${id_task} not found.`);
    }

    const changeTask = await this.taskRepository.preload({
      id: task.id,
      status
    });

    try {
      
      return await this.taskRepository.save(changeTask);

    }catch(error){
      
      this.handleDBError(error);
      
    }

  }

  async findAllPaginate(tasksPaginationDto: TasksPaginationDto){

    const { id_project, limit = 10, offset = 0 } = tasksPaginationDto;

    const project = await this.projectsService.findOne(id_project);

    const totalTasks = await this.listTasksProject(id_project);

    const tasks = await this.taskRepository.find({
      where: {project_id: project, is_active: 1},
      take: limit,
      skip: offset,
      order: {update_at: 'DESC'}
    })

    return {
      total: totalTasks.length,
      tasks
    }

  }

  async findAll() {
    return this.taskRepository.find({
      where: {is_active: 1}
    }); 
  }

  async findAllProjectState(id: number, paginationTaskStateDto: PaginationTaskStateDto){

    const { limit, status } = paginationTaskStateDto;

    const project = await this.projectsService.findOne(id);

    if(!project){
      throw new NotFoundException(`Project id: ${id} not found.`);
    }

    const tasks = await this.taskRepository.find({
      where: {status: status, project_id: project, is_active: 1},
      take: limit,
      order: {
        create_at: 'DESC'
      }
    })

    return {
      total: tasks.length,
      tasks
    }

  }

  async listTasksProject(idProject: number){

    const project = await this.projectsService.findOne(idProject);

    return this.taskRepository.find({
      where: {project_id: project, is_active: 1},
      order: {update_at: 'DESC'}
    })

    // const LIMIT_PER_STATUS = 5;
    // const statuses = ['PENDING', 'IN_PROGRESS', 'DONE'];
    // const allTasks = [];

    // for (const status of statuses) {
    //     const tasks = await this.taskRepository
    //         .createQueryBuilder('tasks')
    //         .leftJoinAndSelect('tasks.project_id', 'projects')
    //         .leftJoinAndSelect('tasks.user_assigned', 'users')
    //         .where('tasks.project_id = :projectId', { projectId: idProject })
    //         .andWhere('tasks.status = :status', { status })
    //         .andWhere('tasks.is_active = :isActive', { isActive: 1 })
    //         .orderBy('tasks.update_at', 'DESC')
    //         .take(LIMIT_PER_STATUS)
    //         .getMany();

    //     allTasks.push(...tasks);
    // }

    // return allTasks;

    
  }

  async findOne(id: number) {
    
    const task = this.taskRepository.findOneBy({id: id});

    if(!task){
      throw new NotFoundException(`Task with id: ${id} not found.`);
    }

    return task;

  }

  async update(id: number, request: Request, updateTaskDto: UpdateTaskDto){

    if(!request['user']){
      throw new UnauthorizedException(`There is not Bearer Token`);
    }

    const { title, description } = updateTaskDto;
    
    // console.log(files);

    // for (const file of files) {
    // }

    const task = await this.findOne(id);

    if(!task){
      throw new BadRequestException(`Task with ${id} not found`);
    }

    try{

      const taskUpd = await this.taskRepository.preload({
        id: id,
        title,
        description
      });

      return await this.taskRepository.save(taskUpd);
      
    }catch(error){

      console.log(error);
      this.handleDBError(error);
      
    }


  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  private handleDBError(error: any){
    
    if(error.sqlState === '23000'){

      console.log(error);
      throw new BadRequestException(`The Code Project already exist.`);

    }else{

      console.log(error);
      throw new InternalServerErrorException(`Please check the server log.`);
      
    }

  }

}
