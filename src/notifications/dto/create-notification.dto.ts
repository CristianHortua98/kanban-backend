import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {

    @Type(() => Number)
    @IsNotEmpty({message: 'Task is required'})
    id_task: number;


    @Type(() => Number)
    @IsNotEmpty({message: 'User is required'})
    id_user: number;

}
