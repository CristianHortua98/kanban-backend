import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
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

        userResponse,
        token: this.authService.getJwtToken({
          id: userResponse.id,
          document: userResponse.document,
          user: userResponse.user
        })

      }

    }catch(error){

      this.handleDBError(error);
      
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
