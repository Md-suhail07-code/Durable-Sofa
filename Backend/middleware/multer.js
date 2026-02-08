import multer from 'multer';

const storage = multer.memoryStorage();

// single file upload middleware
export const singleUpload = multer({ storage }).single('file');

// multiple files upload middleware
export const multipleUpload = multer({ storage }).array('files', 5); // max 5 files