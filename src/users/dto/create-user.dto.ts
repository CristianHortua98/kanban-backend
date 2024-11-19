import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEmail, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { Rol } from "../entities/rol.entity";

export class CreateUserDto {

    @Type(() => Number)
    @IsOptional()
    id?: number;

    @IsString()
    @MinLength(10)
    fullname: string;

    @Type(() => Number)
    @Min(100000)
    @Max(99999999999999)
    document: number;

    @Type(() => Number)
    @Min(100000)
    @Max(99999999999999)
    phone: number;

    @IsString()
    @MinLength(5)
    user: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @IsEmail()
    @MinLength(5)
    email: string;
  
    @IsArray()
    @ArrayMinSize(1, {message: 'Rol is required'})
    @IsInt({each: true})
    roles: number[]

}
