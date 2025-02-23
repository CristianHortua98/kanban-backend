import { IsInt } from "class-validator";

export class AssignedUserTaskDto{

    @IsInt()
    id_task: number;


    @IsInt()
    id_user: number;

}