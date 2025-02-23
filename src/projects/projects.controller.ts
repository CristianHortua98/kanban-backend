import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateProjectCollaboratorsDto } from './dto/create-project-collaborators.dto';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() request: Request, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(request, createProjectDto);
  }

  @Post('add-collaborators')
  addProjectCollaborators(@Body() createProjectCollaborators: CreateProjectCollaboratorsDto){
    return this.projectsService.addProjectCollaborators(createProjectCollaborators);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('detail-project-collaborators/:id_project')
  detailProjectCollaborators(@Param('id_project', ParseIntPipe) idProject: number){
    return this.projectsService.detailProjectCollaborators(idProject);
  }

  @Get('user/:id_user')
  listProjectsUser(@Param('id_user', ParseIntPipe) idUser: number){
    return this.projectsService.listProjectsUser(idUser);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Get('projects-collaborator/:id_user')
  listaProjectsCollaborator(@Param('id_user', ParseIntPipe) idUser: number){
    return this.projectsService.listProjectsCollaborator(idUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
