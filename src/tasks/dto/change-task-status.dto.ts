import { IsEnum, IsInt, IsString } from "class-validator";
import { TaskStatus } from "../interfaces/task-status.enum";
import { Transform } from "class-transformer";

export class ChangeTaskStatusDto{

    @IsInt()
    id_task: number;

    @Transform(({ value }) => value.toUpperCase())
    @IsEnum(TaskStatus, {message: 'status must be PENDING, IN_PROGRESS, DONE'})
    status: TaskStatus;

}