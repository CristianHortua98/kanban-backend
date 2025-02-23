import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { TaskStatus } from "../interfaces/task-status.enum";

export class CreateTaskDto {

    @Type(() => Number)
    @IsOptional()
    id?: number;

    @IsString()
    @MinLength(5)
    @MaxLength(300)
    title: string;

    @Type(() => Number)
    @IsNotEmpty({message: 'Project is required'})
    project_id: number;


    @IsString()
    @IsOptional()
    @MaxLength(65000)
    description?: string;


    @IsString()
    @IsOptional()
    @MinLength(3)
    status?: TaskStatus;
    

    @IsOptional()
    files?: File[];

    

}
