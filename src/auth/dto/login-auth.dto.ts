import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{

    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    password: string;

}