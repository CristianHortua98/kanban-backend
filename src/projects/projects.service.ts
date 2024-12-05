import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CreateProjectCollaborators } from './dto/create-project-collaborators.dto';

@Injectable()
export class ProjectsService {
  
  constructor(

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService

  ){}
  
  async create(request: Request, createProjectDto: CreateProjectDto) {

    if(!request['user']){
      throw new UnauthorizedException(`There is not Bearer Token`);
    }

    const userSesion: User = request['user'];
    
    try{

      const project = this.projectRepository.create({
        user_created: userSesion,
        ...createProjectDto
      });

      return await this.projectRepository.save(project);
      
    }catch(error){
      
      console.log(error);
      throw new InternalServerErrorException(`Check logs server`);

    }

  }

  async addProjectCollaborators(createProjectCollaborators: CreateProjectCollaborators){

    const { collaborators, project } = createProjectCollaborators;

    const projectInstance = await this.projectRepository.findOne({
      where: {id: project},
      relations: ['collaborators']
    })

    for (const collaborator of collaborators) {

      let userCollaborator = await this.usersService.findOne(collaborator);

      if(!userCollaborator){
        throw new NotFoundException(`User id: ${collaborator} not found.`);
      }
      
      projectInstance.collaborators.push(userCollaborator);

    }

    try{

      return await this.projectRepository.save(projectInstance);
      
    }catch(error){

      console.log(error);
      throw new InternalServerErrorException(`Check logs server`);
      
    }

  }

  async findAll(){

    return await this.projectRepository.find();

  }

  async findOne(id: number) {

    const project = await this.projectRepository.findOneBy({id: id})

    if(!project){
      throw new NotFoundException(`Project id: ${id} not found.`);
    }

    return project;

  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
