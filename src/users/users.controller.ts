import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete('desactive-user/:id')
  desactiveUser(@Param('id', ParseIntPipe) id: number){
    return this.usersService.desactiveUser(id);
  }

  @Get('all-collaborators/:id_user')
  findAllCollaborators(@Param('id_user', ParseIntPipe) idUser: number) {
    return this.usersService.findAllCollaborators(idUser);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('all-roles')
  findAllRoles(){
    return this.usersService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
