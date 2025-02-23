import { Type } from "class-transformer";
import { IsEnum, IsOptional, Min } from "class-validator";
import { TaskStatus } from "src/tasks/interfaces/task-status.enum";

export class PaginationTaskStateDto{

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    limit?: number;

    @IsOptional()
    @IsEnum(TaskStatus, {
        message: 'status must be one of the following: PENDING, IN_PROGRESS, DONE',
    })
    status: TaskStatus;

}