import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationTaskStateDto } from 'src/common/dtos/pagination-task-state.dto';
import { AssignedUserTaskDto } from './dto/assigned-user-task.dto';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
import { TasksPaginationDto } from 'src/common/dtos/task-pagination.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(request, createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('list-tasks-project/:id')
  listTasksProject(@Param('id', ParseIntPipe) id: number){
    return this.tasksService.listTasksProject(id);

  }

  @Put('assigned-user-task')
  assignedUserTask(@Body() assignedUserTaskDto: AssignedUserTaskDto){
    return this.tasksService.assignedUserTask(assignedUserTaskDto);
  }

  @Put('change-task-status')
  changeTaskStatus(@Body() changeTaskStatusDto: ChangeTaskStatusDto){
    return this.tasksService.changeTaskStatus(changeTaskStatusDto);
  }

  @Get('list-task-state/:id')
  findAllProjectState(@Param('id', ParseIntPipe) id: number, @Query() paginationTaskStateDto: PaginationTaskStateDto){
    return this.tasksService.findAllProjectState(id, paginationTaskStateDto);
  }

  @Get('list-tasks-paginate')
  findAllPaginate(@Query() tasksPaginationDto: TasksPaginationDto){
    return this.tasksService.findAllPaginate(tasksPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Req() request: Request, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, request, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
