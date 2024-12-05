import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @IsString()
    @MinLength(2)
    code: string;

}
