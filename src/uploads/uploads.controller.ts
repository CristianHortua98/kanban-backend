import { BadRequestException, Controller, Get, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileFilterImage } from './helpers/fileFilterImage.helper';
import { diskStorage } from 'multer';
import * as path from 'path';
import { fileNamerImage } from './helpers/fileNamerImage.helper';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { fileNamerFile } from './helpers/fileNamerFile.helper';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('uploads')
export class UploadsController {
  
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly configService: ConfigService
  ) {}


  @Get('tasks-files/:id')
  findFilesTask(@Param('id', ParseIntPipe) id: number){

    const pathFiles = this.uploadsService.getFilesTask(id);

    return pathFiles;

  }

  @Get('files-tasks/:id/:filename')
  findFile(@Res() res: Response, @Param('id') id: number, @Param('filename') filename: string){

    const file = this.uploadsService.getStaticFile(id, filename);

    res.sendFile(file);

  }


  @Get('img-tasks/:filename')
  findImage(@Res() res: Response, @Param('filename') filename: string){

    const path = this.uploadsService.getStaticImage(filename);

    res.sendFile(path);

  }

  @UseGuards(AuthGuard)
  @Post('tasks-files/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {

        const idTask = req.params.id;

         const pathTasksFiles = path.resolve(__dirname, '../../../archivos-kanban/uploads/files-tasks');
         const folderPath = path.join(pathTasksFiles, idTask);  // Carpeta con el idTask
 
         if (!fs.existsSync(folderPath)) {
           fs.mkdirSync(folderPath, { recursive: true });
         }

        cb(null, folderPath);

      },
      filename: fileNamerFile
    })
  }))
  filesTasksUpload(@Param('id') idTask: number, @UploadedFiles() files: Express.Multer.File[]){

    if (!files || files.length === 0) {
      throw new BadRequestException('No Files Task Upload');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/uploads/files-tasks/${idTask}`;

    return this.uploadsService.filesTaskUpload(secureUrl);


  }


  @UseGuards(AuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: fileFilterImage,
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, `../../../archivos-kanban/uploads/img-tasks`)
        cb(null, uploadPath);
      },
      filename: fileNamerImage
    })
  }))
  imageUpload(@UploadedFile() image: Express.Multer.File){
    
    if(!image){
      throw new BadRequestException(`Make sure that the file is an Image`);
    }

    const secureUrl = `${this.configService.get('HOST_API')}/uploads/img-tasks/${image.filename}`;

    return this.uploadsService.imageUpload(secureUrl, image.filename);

  }

}
