import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateProjectCollaborators } from './dto/create-project-collaborators.dto';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() request: Request, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(request, createProjectDto);
  }

  @Post('add-collaborators')
  addProjectCollaborators(@Body() createProjectCollaborators: CreateProjectCollaborators){
    return this.projectsService.addProjectCollaborators(createProjectCollaborators);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
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
