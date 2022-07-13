import multer from 'multer';

const storage = multer.diskStorage({
  destination: './public/avatars',
  filename: (req, file, cb) => {
    cb(
      null,
      String(req.body.username).replace(/\./g, '') +
        file.originalname.slice(file.originalname.lastIndexOf('.'))
    );
  },
});

const upload = multer({ storage: storage });
export default upload;
