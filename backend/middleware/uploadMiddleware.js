const multer = require('multer');
const path = require('path');

//Storage Settings:
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');  //local folder
    }, 
    filename: (req, file, cb)=> {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

//file filter for image types:
const fileFilter = (req, file, cb)=>{
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){

        cb(null, true);
    } else{
        cb(new Error('only images are allowed'), false);
    }
};

const upload = multer({storage, fileFilter});

module.exports = upload;