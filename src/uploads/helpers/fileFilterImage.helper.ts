export const fileFilterImage = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png'];

    if(!validExtensions.includes(fileExtension)){
        return callback(null, false);
    }

    callback(null, true);

}