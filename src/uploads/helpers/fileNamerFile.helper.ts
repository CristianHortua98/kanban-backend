import { v4 as uuid } from 'uuid';

export const fileNamerFile = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        return callback(new Error('File is empty'), false);
    }

    const fileExtension = file.mimetype.split('/')[1]; // Obtener extensión del archivo
    const fileName = `${uuid()}.${fileExtension}`; // Crear un nombre único

    callback(null, fileName);
};