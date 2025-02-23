import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {

    constructor(
        private readonly configService: ConfigService
      ) {}

    getFilesTask(idTask: number){


        const urlPath = join(__dirname, `../../../archivos-kanban/uploads/files-tasks/${idTask}`);

        const urlSecure = `${this.configService.get('HOST_API')}/uploads/files-tasks/${idTask}`.replace(/\\/g, '/');


        if(!existsSync(urlPath)){
            return [];
        }

        const files = readdirSync(urlPath);

        return files.map(file => `${urlSecure}/${file}`.replace(/\\/g, '/'));

    }

    getStaticFile(id: number, filename: string){

        const path = join(__dirname, `../../../archivos-kanban/uploads/files-tasks/${id}/${filename}`);
        
        if(!existsSync(path)){
            throw new BadRequestException(`File not found with ${filename}`);
        }

        return path;


    }

    getStaticImage(filename: string){

        const path = join(__dirname, `../../../archivos-kanban/uploads/img-tasks/${filename}`);

        if(!existsSync(path)){
            throw new BadRequestException(`Image not found with ${filename}`);
        }

        return path;

    }

    async filesTaskUpload(path: string){

        return {
            url: path
        }

    }

    async imageUpload(path: string, filename: string){

        return {
            url: path
        }

    }

}
