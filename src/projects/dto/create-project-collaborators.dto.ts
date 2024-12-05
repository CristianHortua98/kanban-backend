import { User } from "src/users/entities/user.entity";
import { Project } from "../entities/project.entity";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class CreateProjectCollaborators{

    @Type(() => Number)
    @IsNotEmpty({message: 'Project is required'})
    project: number;

    @IsArray()
    @ArrayMinSize(1, {message: 'Collaborator is required'})
    @IsInt({each: true})
    collaborators: number[];

}