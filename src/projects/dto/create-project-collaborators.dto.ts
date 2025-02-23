import { User } from "src/users/entities/user.entity";
import { Project } from "../entities/project.entity";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateProjectCollaboratorsDto{

    @Type(() => Number)
    @IsNotEmpty({message: 'Project is required'})
    project: number;

    @IsArray()
    // @ArrayMinSize(1, {message: 'Collaborator is required'})
    @IsInt({each: true})
    @IsOptional()
    collaborators?: number[];

}