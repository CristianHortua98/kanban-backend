import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class TasksPaginationDto{

    @IsInt()
    @Type(() => Number)
    @IsNotEmpty()
    id_project: number;


    @IsOptional()
    @Type(() => Number)
    @Min(0)
    limit?: number;
    
    
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number; 


}