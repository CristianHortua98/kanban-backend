import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { userInfo } from 'os';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ){}


  async login(loginUserDto: LoginUserDto){

    const { username, password } = loginUserDto;

    const infoUser = await this.usersService.findUsername(username);

    if(!infoUser){
      throw new NotFoundException(`Username: ${username} not found.`);
    }

    if(infoUser.is_active !== 1){
      throw new UnauthorizedException(`User: ${username} not activated.`);
    }

    if(!bcrypt.compareSync(password, infoUser.password)){
      throw new UnauthorizedException(`Credentials not valid, password incorrect.`);
    }

    delete infoUser.password;

    return {

      user: infoUser,
      token: this.getJwtToken({
        id: infoUser.id,
        document: infoUser.document,
        username: infoUser.username
      })

    }


  }

  async checkToken(request: Request){

    // console.log(request);

    const user: User = request['user'];

    const infoUser = await this.usersService.findUsername(user.username);

    if(!infoUser){
      throw new UnauthorizedException(`User not exist.`);
    }

    return {

      user: infoUser,
      token: this.getJwtToken({
        id: infoUser.id,
        document: infoUser.document,
        username: infoUser.username
      })

    }

  }

  getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;

  }

}
