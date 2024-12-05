import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolesReporsitory: Repository<Rol>,
  ){}
  
  async create(createUserDto: CreateUserDto){

    const { roles, password, ...userData } = createUserDto;

    const userNew = this.usersRepository.create(userData);

    const roleArray = await this.rolesReporsitory.findBy({
      id: In(roles)
    })

    if(roleArray.length !== roles.length){
      throw new InternalServerErrorException(`Roles not found`);
    }

    userNew.roles = roleArray;

    try {

      const user = this.usersRepository.create({
        ...userNew,
        password: bcrypt.hashSync(password, 10)
      });
  
      const userResponse = await this.usersRepository.save(user);
      delete userResponse.password;

      return {

        userResponse
        // token: this.authService.getJwtToken({
        //   id: userResponse.id,
        //   document: userResponse.document,
        //   user: userResponse.user
        // })

      }

    }catch(error){

      this.handleDBError(error);
      
    }

  }

  async findAll(){

    return await this.usersRepository.find();

  }

  async findOne(id: number) {

    const user = await this.usersRepository.findOneBy({
      id: id
    });

    if(!user){
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    delete user.password;

    return user;

  }

  async findUsername(username: string){

    const user = await this.usersRepository.findOne({
      where: {username: username},
      select: { id: true, fullname: true, document: true, phone: true, username: true, password: true, email: true, is_active: true, create_at: true, projects: true }
    });

    if(!user){
      throw new NotFoundException(`User with Username: ${username} not found.`);
    }

    return user;

  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const { roles, ...userData } = updateUserDto;

    if(roles.length === 0){
      throw new BadRequestException(`Roles is required.`);
    }

    const roleArray = await this.rolesReporsitory.findBy({
      id: In(roles)
    })

    if(roleArray.length !== roles.length){
      throw new InternalServerErrorException(`Roles not found`);
    }

    const user = await this.usersRepository.preload({
      id: id,  
      ...userData
    });


    if(!user){
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    try{

      const newUser = await this.usersRepository.save({
        roles: roleArray,
        ...user
      });

      return newUser;
      
    }catch(error) {

      this.handleDBError(error);
      
    }

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDBError(error: any){

    if(error.sqlState === '23000'){

      console.log(error);
      throw new BadRequestException(`The Document Number or User already exists.`);

    }else{

      console.log(error);
      throw new InternalServerErrorException(`Please check the server log.`);
      
    }

  }

}
