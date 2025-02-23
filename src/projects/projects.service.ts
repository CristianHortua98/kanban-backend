import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CreateProjectCollaboratorsDto } from './dto/create-project-collaborators.dto';

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
      this.handleDBError(error);
      // throw new InternalServerErrorException(`Check logs server`);

    }

  }

  async detailProjectCollaborators(idProject: number){

    return await this.projectRepository.findOne({
      relations: ['collaborators'],
      where: { id: idProject }
    });

  }

  async addProjectCollaborators(createProjectCollaborators: CreateProjectCollaboratorsDto){

    const { collaborators, project } = createProjectCollaborators;

    const projectInstance = await this.projectRepository.findOne({
      where: { id: project },
      relations: ['collaborators'], // Asegúrate de cargar la relación
    });

    if (!projectInstance) {
      throw new NotFoundException(`Project id: ${project} not found.`);
    }

    // Filtrar colaboradores existentes que ya no están en la nueva lista
    projectInstance.collaborators = projectInstance.collaborators.filter(existingCollaborator =>
      collaborators.includes(existingCollaborator.id)
    );

    // Agregar los nuevos colaboradores
    for (const collaborator of collaborators) {
      const userCollaborator = await this.usersService.findOne(collaborator);

      if (!userCollaborator) {
        throw new NotFoundException(`User id: ${collaborator} not found.`);
      }

      // Evitar duplicados
      if (!projectInstance.collaborators.some(c => c.id === userCollaborator.id)) {
        projectInstance.collaborators.push(userCollaborator);
      }
    }

    try {
      return await this.projectRepository.save(projectInstance);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Check server logs`);
    }


  }

  async listProjectsUser(idUser: number){

    const user = await this.usersService.findOne(idUser);

    try {
     
      return this.projectRepository.find({where: {user_created: user}});

    }catch(error){

      console.log(error);
      throw new InternalServerErrorException(`Check logs server`);
      
    }

  }

  async listProjectsCollaborator(idUser: number){

    // return this.projectRepository
    //   .createQueryBuilder('project')
    //   .innerJoin('projects_collaborators', 'pc', 'project.id = pc.id_project')
    //   .where('pc.id_user = :idUser', { idUser })
    //   .getMany();

    return this.projectRepository.find({
      relations: ['collaborators'],
      where: { collaborators: {id: idUser} }
    });

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
