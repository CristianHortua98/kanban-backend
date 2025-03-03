import { Type } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    message: string;

    @Type(() => Number)
    @IsNotEmpty({message: 'id_task is required'})
    id_task: number;

    @Type(() => Number)
    @IsNotEmpty({message: 'id_user is required'})
    id_user: number;

}
