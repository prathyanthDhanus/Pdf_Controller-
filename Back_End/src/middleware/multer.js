// const multer = require("multer")

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './files')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() 

//       cb(null,uniqueSuffix+file.originalname)
//     }
//   })
  
//   const upload = multer({ storage: storage })

//   module.exports = upload
const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
            const fileType = file.mimetype.split('/')[1]
            cb(null, file.fieldname + '-' + Date.now() + "." + fileType);
        } 
    }),
});

module.exports = upload; 

