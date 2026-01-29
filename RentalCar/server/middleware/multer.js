// import multer from 'multer';

// const upload = multer({
//     storage: multer.diskStorage({})});

// export default upload;
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
