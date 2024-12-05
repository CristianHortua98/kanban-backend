import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import * as request from 'supertest';
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from '../../users/users.service';


@Injectable()
export class AuthGuard implements CanActivate{


    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException(`There is not Bearer Token.`)
        }

        try{

            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {secret: process.env.JWT_SEED});
            
            const user = await this.usersService.findOne(payload.id);

            if(!user){
                throw new UnauthorizedException(`User does not exists.`);
            }


            if(user.is_active !== 1){
                throw new UnauthorizedException(`User is not active`);
            }

            request['user'] = user;

        }catch(error) {

            throw new UnauthorizedException();
            
        }

        return true;


    }


    private extractTokenFromHeader(request: Request): string | undefined{

        if(request.headers['authorization']){

            const [type, token] = request.headers['authorization'].split(' ') ?? [];
            
            return type === 'Bearer' ? token : undefined;

        }

        return undefined;

    }

}